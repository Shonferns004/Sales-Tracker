import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { normalizeDate, normalizePriority, normalizeStage } from '../lib/leads';
import { today } from './date';

function getFileExtension(file) {
  return String(file?.name || '')
    .split('.')
    .pop()
    .toLowerCase();
}

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function normalizeText(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function normalizePhone(value) {
  const text = normalizeText(value);
  if (!text) return null;

  // Excel often stores phone numbers as numeric strings ending in .00.
  const withoutTrailingDecimals = text.replace(/\.0+$/, '');
  return withoutTrailingDecimals || null;
}

function normalizeImportedDate(value) {
  if (value === undefined || value === null || value === '') return null;

  if (typeof value === 'number' && Number.isFinite(value)) {
    const excelDate = XLSX.SSF.parse_date_code(value);
    if (!excelDate) return null;
    const month = String(excelDate.m).padStart(2, '0');
    const day = String(excelDate.d).padStart(2, '0');
    return `${excelDate.y}-${month}-${day}`;
  }

  const text = String(value).trim();
  if (!text) return null;

  const ddmmyyyyMatch = text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  const yyyymmddMatch = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (yyyymmddMatch) {
    const [, year, month, day] = yyyymmddMatch;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  return normalizeDate(text);
}

function buildNormalizedRow(row) {
  return Object.entries(row || {}).reduce((accumulator, [key, value]) => {
    accumulator[normalizeKey(key)] = value;
    return accumulator;
  }, {});
}

export function readCsvFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read CSV file.'));
    reader.readAsText(file);
  });
}

function readSpreadsheetFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read spreadsheet file.'));
    reader.readAsArrayBuffer(file);
  });
}

function getValue(row, keys) {
  const normalizedRow = buildNormalizedRow(row);

  for (const key of keys) {
    const value = normalizedRow[normalizeKey(key)];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value;
    }
  }

  return null;
}

function hasAnyLeadData(lead) {
  return [lead.name, lead.phone, lead.stage, lead.priority, lead.followUpDate, lead.createdDate].some(
    (value) => value !== null && value !== ''
  );
}

export function mapCsvRows(parsedRows) {
  return parsedRows
    .map((lead) => {
      const stageValue = getValue(lead, ['stage', 'lead stage', 'status']);
      const priorityValue = getValue(lead, ['priority', 'lead priority']);
      const followUpValue = getValue(lead, ['followUpDate', 'followUp', 'Follow Up', 'follow up date', 'Follow Up Date', 'next follow up']);
      const createdValue = getValue(lead, ['createdDate', 'createdAt', 'Created', 'created date', 'Created Date']);

      return {
        name: normalizeText(getValue(lead, ['name', 'Name', 'full name', 'Full Name', 'customer name', 'lead name'])),
        phone: normalizePhone(getValue(lead, ['phone', 'Phone', 'phone number', 'Phone Number', 'mobile', 'Mobile', 'mobile number'])),
        stage: stageValue ? normalizeStage(stageValue) : null,
        priority: priorityValue ? normalizePriority(priorityValue) : null,
        followUpDate: normalizeImportedDate(followUpValue),
        createdDate: normalizeImportedDate(createdValue) ?? today(),
      };
    })
    .filter(hasAnyLeadData);
}

function parseSpreadsheetRows(file, workbook) {
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error(`No sheets found in ${file.name}.`);
  }

  const sheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json(sheet, {
    defval: null,
    raw: false,
  });
}

export async function parseCsvFile(file) {
  const extension = getFileExtension(file);

  if (extension === 'csv') {
    const text = await readCsvFile(file);
    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => String(header || '').trim(),
    });

    if (parsed.errors.length) {
      throw new Error(parsed.errors[0].message);
    }

    return mapCsvRows(parsed.data);
  }

  if (extension === 'xlsx' || extension === 'xls') {
    const buffer = await readSpreadsheetFile(file);
    const workbook = XLSX.read(buffer, { type: 'array' });
    return mapCsvRows(parseSpreadsheetRows(file, workbook));
  }

  throw new Error('Only .csv, .xlsx, and .xls files are supported.');
}

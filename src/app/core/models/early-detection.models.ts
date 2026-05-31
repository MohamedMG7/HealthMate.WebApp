export interface EarlyDetectionResult {
  animea: boolean;
  confidence: number | null;
  modelVersion: string;
}

export interface EdFieldSpec {
  key: string;
  label: string;
  isCategory?: boolean;
}

export interface EdModelSpec {
  key: string;
  label: string;
  fields: EdFieldSpec[];
}

export const EARLY_DETECTION_MODELS: EdModelSpec[] = [
  {
    key: 'anemia',
    label: 'Anemia',
    fields: [
      { key: 'hb',   label: 'Hemoglobin (g/dL)' },
      { key: 'mch',  label: 'MCH (pg)' },
      { key: 'mchc', label: 'MCHC (g/dL)' },
      { key: 'mcv',  label: 'MCV (fL)' },
    ]
  },
  {
    key: 'ckd',
    label: 'Chronic Kidney Disease',
    fields: [
      { key: 'sc',   label: 'Serum creatinine (mg/dL)' },
      { key: 'bu',   label: 'Blood urea (mg/dL)' },
      { key: 'hemo', label: 'Hemoglobin (g/dL)' },
      { key: 'al',   label: 'Albumin (0–5)' },
      { key: 'bgr',  label: 'Blood glucose random (mg/dL)' },
      { key: 'sod',  label: 'Sodium (mEq/L)' },
      { key: 'pot',  label: 'Potassium (mEq/L)' },
      { key: 'pcv',  label: 'Packed cell volume (%)' },
    ]
  },
  {
    key: 'liver',
    label: 'Liver Disease',
    fields: [
      { key: 'age',    label: 'Age' },
      { key: 'gender', label: 'Gender', isCategory: true },
      { key: 'tb',     label: 'Total bilirubin (mg/dL)' },
      { key: 'db',     label: 'Direct bilirubin (mg/dL)' },
      { key: 'alkphos',label: 'Alk. phosphatase (IU/L)' },
      { key: 'sgpt',   label: 'ALT/SGPT (IU/L)' },
      { key: 'sgot',   label: 'AST/SGOT (IU/L)' },
      { key: 'tp',     label: 'Total proteins (g/dL)' },
      { key: 'alb',    label: 'Albumin (g/dL)' },
      { key: 'agr',    label: 'A/G ratio' },
    ]
  },
  {
    key: 'hcv',
    label: 'Hepatitis C',
    fields: [
      { key: 'age',  label: 'Age' },
      { key: 'sex',  label: 'Sex', isCategory: true },
      { key: 'alb',  label: 'Albumin (g/dL)' },
      { key: 'alp',  label: 'ALP (IU/L)' },
      { key: 'alt',  label: 'ALT (IU/L)' },
      { key: 'ast',  label: 'AST (IU/L)' },
      { key: 'bil',  label: 'Bilirubin (mg/dL)' },
      { key: 'che',  label: 'Cholinesterase' },
      { key: 'chol', label: 'Cholesterol (mg/dL)' },
      { key: 'crea', label: 'Creatinine (mg/dL)' },
      { key: 'ggt',  label: 'GGT (IU/L)' },
      { key: 'prot', label: 'Total protein (g/dL)' },
    ]
  },
  {
    key: 'thyroid',
    label: 'Thyroid Disorder',
    fields: [
      { key: 'tsh', label: 'TSH (mIU/L)' },
      { key: 't3',  label: 'T3' },
      { key: 'tt4', label: 'TT4' },
      { key: 't4u', label: 'T4U' },
      { key: 'fti', label: 'FTI' },
    ]
  },
];

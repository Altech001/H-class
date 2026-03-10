export interface CertificateData {
  recipientName: string;
  courseName: string;
  organization: string;
  date: string;
  title: string;
  signatureLeft: string;
  titleLeft: string;
  signatureRight: string;
  titleRight: string;
  serialNumber: string;
}

export type TemplateType = "classic" | "modern" | "elegant" | "corporate";

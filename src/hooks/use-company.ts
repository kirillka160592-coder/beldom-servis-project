import { useContentBlock } from '@/hooks/use-content';
import { COMPANY, type CompanyData } from '@/data/company';

export function useCompany(): CompanyData {
  const { data } = useContentBlock<CompanyData>('company', COMPANY);
  return data;
}

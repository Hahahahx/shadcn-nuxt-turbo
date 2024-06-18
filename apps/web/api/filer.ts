export interface FilerInfo { Name: string; Address: string; ID: string | number; OSSAddress: string }

export const filerApi = {
  list: () => request.get<FilerInfo[]>(
    'dep_dashboard/filer/list',
  ),
}

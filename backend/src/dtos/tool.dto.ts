export interface CreateToolDTO {
  toolCode: string;
  name: string;
  category: string;
  location?: string;
}

export interface UpdateToolDTO {
  name?: string;
  category?: string;
  location?: string;
  status?: 'AVAILABLE' | 'ISSUED' | 'MISSING';
}

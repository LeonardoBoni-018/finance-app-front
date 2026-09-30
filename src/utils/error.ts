export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  fields?: Record<string, string>;
  timestamp: string;
  path: string;
}

export const mapApiError = (error: unknown): Error => {
  if (error instanceof Error) return error;

  const axiosError = error as {
    response?: {
      status: number;
      data: ProblemDetail | string;
    };
    message?: string;
  };

  if (axiosError.response) {
    const { status, data } = axiosError.response;

    if (typeof data === 'object' && data !== null && 'title' in data) {
      const problem = data as ProblemDetail;
      let message = problem.detail || problem.title;

      if (problem.fields) {
        const fieldMessages = Object.entries(problem.fields).map(([field, msg]) => `${field}: ${msg}`).join('; ');
        message += ` (${fieldMessages})`;
      }

      return new Error(message);
    }

    if (typeof data === 'string') return new Error(data);

    switch (status) {
      case 400: return new Error('Dados inválidos. Verifique os campos.');
      case 401: return new Error('Sessão expirada. Faça login novamente.');
      case 403: return new Error('Acesso negado.');
      case 404: return new Error('Recurso não encontrado.');
      case 409: return new Error('Conflito: recurso já existe.');
      case 422: return new Error('Erro de validação.');
      case 500: return new Error('Erro interno do servidor. Tente novamente.');
      default: return new Error(`Erro ${status}: ${axiosError.message ?? 'Erro desconhecido'}`);
    }
  }

  if (axiosError.message?.includes('Network Error')) {
    return new Error('Sem conexão com o servidor. Verifique sua internet.');
  }

  return new Error(axiosError.message ?? 'Erro inesperado');
};
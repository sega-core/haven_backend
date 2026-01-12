import { 
  BaseError as SequelizeBaseError,
  ForeignKeyConstraintError,
  ValidationError as SequelizeValidationError,
  UniqueConstraintError,
  DatabaseError,
  BaseError
} from 'sequelize';

export interface NormalizedError {
  type: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  statusCode: number;
}

export const normalizeSequelizeError = (error: any): NormalizedError => {
  const timestamp = new Date().toISOString();
  
  // Ошибки внешнего ключа
  if (error instanceof ForeignKeyConstraintError) {
    const pgError = error.parent as any;
    
    return {
      type: 'FOREIGN_KEY_CONSTRAINT',
      message: 'Связанная запись не найдена',
      details: {
        table: error.table,
        constraint: error.index,
        ...(pgError && {
          pgCode: pgError.code,
          detail: pgError.detail,
          hint: pgError.hint
        })
      },
      timestamp,
      statusCode: 400
    };
  }
  
  // Ошибки валидации
  if (error instanceof SequelizeValidationError) {
    return {
      type: 'VALIDATION_ERROR',
      message: 'Ошибка валидации данных',
      details: {
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message,
          value: err.value,
          validatorKey: err.validatorKey
        }))
      },
      timestamp,
      statusCode: 400
    };
  }
  
  // Ошибки уникальности
  if (error instanceof UniqueConstraintError) {
    return {
      type: 'UNIQUE_CONSTRAINT',
      message: 'Запись уже существует',
      details: {
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message,
          value: err.value
        }))
      },
      timestamp,
      statusCode: 409
    };
  }
  
  // Общие ошибки базы данных
  if (error instanceof DatabaseError) {
    const pgError = error.parent as any;
    
    return {
      type: 'DATABASE_ERROR',
      message: 'Ошибка выполнения запроса к базе данных',
      details: pgError ? {
        code: pgError.code,
        detail: pgError.detail,
        table: pgError.table,
        constraint: pgError.constraint
      } : undefined,
      timestamp,
      statusCode: 400
    };
  }
  
  // Прочие ошибки Sequelize
  if (error instanceof SequelizeBaseError) {
    return {
      type: 'SEQUELIZE_ERROR',
      message: error.message,
      timestamp,
      statusCode: 500
    };
  }
  
  // Стандартные ошибки
  return {
    type: error.name || 'UNKNOWN_ERROR',
    message: error.message || 'Неизвестная ошибка',
    timestamp,
    statusCode: error.statusCode || 500
  };
};

// Создание пользовательских ошибок
export class NotFoundError extends Error {
  statusCode = 404;
  type = 'NOT_FOUND';
  
  constructor(entity: string, id?: string | number) {
    const message = id 
      ? `${entity} с ID ${id} не найден`
      : `${entity} не найден`;
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  statusCode = 400;
  type = 'VALIDATION_ERROR';
  
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends Error {
  statusCode = 401;
  type = 'UNAUTHORIZED';
  
  constructor(message = 'Требуется авторизация') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

// Утилита для быстрого создания ошибок
export const createError = (type: string, message: string, statusCode = 500, details?: any) => {
  const error: any = new Error(message);
  error.type = type;
  error.statusCode = statusCode;
  error.details = details;
  return error;
};
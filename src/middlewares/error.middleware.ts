import { Request, Response, NextFunction } from 'express';
import { 
  ForeignKeyConstraintError,
  ValidationError,
  UniqueConstraintError,
  DatabaseError
} from 'sequelize';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[ERROR HANDLER]', {
    name: err.name,
    message: err.message,
    path: req.path,
    method: req.method
  });

  // Обработка ошибок внешнего ключа (ForeignKeyConstraintError)
  if (err instanceof ForeignKeyConstraintError) {
    const pgError = err.parent as any;
    
    return res.status(400).json({
      success: false,
      error: {
        type: 'FOREIGN_KEY_CONSTRAINT',
        message: 'Связанный объект не существует',
        details: {
          table: err.table,
          constraint: err.index,
          ...(pgError?.detail && { 
            detail: pgError.detail,
            field: extractFieldFromDetail(pgError.detail),
            value: extractValueFromDetail(pgError.detail)
          })
        }
      }
    });
  }

  // Обработка ошибок валидации
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: {
        type: 'VALIDATION_ERROR',
        message: 'Ошибка валидации данных',
        details: err.errors.map(error => ({
          field: error.path,
          message: error.message,
          value: error.value,
          type: error.type
        }))
      }
    });
  }

  // Обработка ошибок уникальности
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      success: false,
      error: {
        type: 'UNIQUE_CONSTRAINT',
        message: 'Запись с такими данными уже существует',
        details: err.errors.map(error => ({
          field: error.path,
          value: error.value,
          message: error.message
        }))
      }
    });
  }

  // Обработка общих ошибок базы данных
  if (err instanceof DatabaseError) {
    const pgError = err.parent as any;
    
    return res.status(400).json({
      success: false,
      error: {
        type: 'DATABASE_ERROR',
        message: 'Ошибка базы данных',
        details: {
          code: pgError?.code,
          detail: pgError?.detail,
          table: pgError?.table,
          constraint: pgError?.constraint
        }
      }
    });
  }

  // Обработка кастомных AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        type: err.name.replace('Error', '').toUpperCase(),
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      }
    });
  }

  // Обработка прочих ошибок
  const statusCode = ('statusCode' in err ? (err as any).statusCode : 500) || 500;
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(statusCode).json({
    success: false,
    error: {
      type: 'INTERNAL_ERROR',
      message: isProduction ? 'Внутренняя ошибка сервера' : err.message,
      ...(!isProduction && { 
        name: err.name,
        stack: err.stack 
      })
    }
  });
};

// Вспомогательные функции
function extractFieldFromDetail(detail: string): string | null {
  const match = detail.match(/Key \((.+)\)=\(/);
  return match ? match[1] : null;
}

function extractValueFromDetail(detail: string): string | null {
  const match = detail.match(/\)=\((.+)\)/);
  return match ? match[1] : null;
}
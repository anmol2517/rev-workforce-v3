import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event: any) => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        // Backend wraps all responses in ApiResponse: { success: true, data: T, message: "..." }
        // Unwrap .data so components get the actual payload directly
        if (body !== null && body !== undefined &&
            typeof body === 'object' &&
            'success' in body && 'data' in body) {
          return event.clone({ body: body.data });
        }
      }
      return event;
    })
  );
};

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  get<T>(url: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(url);
  }

  post<T>(url: string, body: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(url, body);
  }

  put<T>(url: string, body: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(url, body);
  }

  delete<T>(url: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(url);
  }
}

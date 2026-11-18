import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../modelli/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com/todos';

  private readonly _todos = signal<Todo[]>([]);
  private readonly _loading = signal(false);
  private readonly _errore = signal<string | null>(null);

  readonly todos = this._todos.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly errore = this._errore.asReadonly();

  caricaTodos(): void {
    if (this._todos().length > 0) return;

    this._loading.set(true);
    this._errore.set(null);

    this.http.get<Todo[]>(this.baseUrl).subscribe({
      next: (dati) => {
        this._todos.set(dati);
        this._loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this._errore.set(this.messaggioErrore(err));
        this._loading.set(false);
      }
    });
  }

  getTodo(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.baseUrl}/${id}`);
  }

  aggiungiTodo(title: string): void {
    this._loading.set(true);
    this._errore.set(null);

    const nuovo = { userId: 1, title, completed: false };

    this.http.post<Todo>(this.baseUrl, nuovo).subscribe({
      next: (creato) => {
        this._todos.update((lista) => [creato, ...lista]);
        this._loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this._errore.set(this.messaggioErrore(err));
        this._loading.set(false);
      }
    });
  }

  messaggioErrore(err: HttpErrorResponse): string {
    if (err.status === 404) {
      return 'Elemento inesistente (Errore 404).';
    }
    if (err.status === 0) {
      return 'Rete assente o server non raggiungibile (Errore 0).';
    }
    return `Errore HTTP ${err.status}: ${err.message}`;
  }
}

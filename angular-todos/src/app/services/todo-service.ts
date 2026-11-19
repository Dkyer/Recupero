import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../modelli/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // Strumento di Angular per fare chiamate HTTP (GET e POST)
  private readonly http = inject(HttpClient);
  // Indirizzo base della risorsa su JSONPlaceholder (contiene 200 todo)
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com/todos';

  // Signal privati: solo questo servizio può modificarli
  private readonly _todos = signal<Todo[]>([]);
  private readonly _loading = signal(false);
  private readonly _errore = signal<string | null>(null);

  // Signal pubblici in sola lettura: i componenti possono solo leggerli
  readonly todos = this._todos.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly errore = this._errore.asReadonly();

  // GET elenco: scarica tutti i 200 todo dall'API
  caricaTodos(): void {
    // Se i dati sono già presenti in memoria, non rifà la chiamata
    if (this._todos().length > 0) return;

    this._loading.set(true);
    this._errore.set(null);

    this.http.get<Todo[]>(this.baseUrl).subscribe({
      next: (dati) => {
        // Salva i 200 todo nel signal e spegne il caricamento
        this._todos.set(dati);
        this._loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        // Salva il messaggio di errore e spegne il caricamento
        this._errore.set(this.messaggioErrore(err));
        this._loading.set(false);
      }
    });
  }

  // GET singolo: legge un todo specifico tramite il suo id
  getTodo(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.baseUrl}/${id}`);
  }

  // POST: crea un nuovo todo e lo aggiunge in fondo all'elenco
  aggiungiTodo(title: string): void {
    this._loading.set(true);
    this._errore.set(null);

    const nuovo = { userId: 1, title, completed: false };

    this.http.post<Todo>(this.baseUrl, nuovo).subscribe({
      next: (creato) => {
        this._todos.update((lista) => {
          // Calcola l'ID progressivo (201, 202...) e lo aggiunge in fondo alla lista
          const todoConId = { ...creato, id: lista.length + 1 };
          return [...lista, todoConId];
        });
        this._loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this._errore.set(this.messaggioErrore(err));
        this._loading.set(false);
      }
    });
  }

  // Restituisce messaggi diversi per elemento inesistente (404) e rete assente (0)
  messaggioErrore(err: HttpErrorResponse): string {
    if (err.status === 404) {
      return 'Elemento inesistente (Errore 404).';
    }
    if (err.status === 0) {
      return 'Rete assente o server non raggiungibile (Errore 0).';
    }
    return `Errore HTTP ${err.status}`;
  }
}


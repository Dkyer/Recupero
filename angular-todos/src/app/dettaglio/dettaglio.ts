import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Todo } from '../modelli/todo';
import { TodoService } from '../services/todo-service';

@Component({
  selector: 'app-dettaglio',
  imports: [RouterLink],
  templateUrl: './dettaglio.html',
  styleUrl: './dettaglio.css'
})
export class Dettaglio implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly todoService = inject(TodoService);

  readonly idCorrente = signal<number>(1);
  readonly todo = signal<Todo | null>(null);
  readonly loading = signal(false);
  readonly errore = signal<string | null>(null);

  ngOnInit(): void {
    // Ascolta i cambi dell'id nell'URL (es. cliccando Precedente/Successivo)
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.idCorrente.set(id);
      this.caricaDettaglio(id);
    });
  }

  caricaDettaglio(id: number): void {
    this.loading.set(true);
    this.errore.set(null);
    this.todo.set(null);

    this.todoService.getTodo(id).subscribe({
      next: (dato) => {
        this.todo.set(dato);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errore.set(this.todoService.messaggioErrore(err));
        this.loading.set(false);
      }
    });
  }

  precedente(): void {
    if (this.idCorrente() > 1) {
      this.router.navigate(['/todos', this.idCorrente() - 1]);
    }
  }

  successivo(): void {
    this.router.navigate(['/todos', this.idCorrente() + 1]);
  }
}

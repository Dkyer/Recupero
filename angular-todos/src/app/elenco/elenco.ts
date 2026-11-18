import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TodoService } from '../services/todo-service';

@Component({
  selector: 'app-elenco',
  imports: [RouterLink],
  templateUrl: './elenco.html',
  styleUrl: './elenco.css'
})
export class Elenco implements OnInit {
  readonly todoService = inject(TodoService);

  // Signal per attivare/disattivare il filtro
  readonly soloDaFare = signal(false);

  // Conteggio calcolato con computed
  readonly totaleCompletati = computed(() =>
    this.todoService.todos().filter((t) => t.completed).length
  );

  // Elenco filtrato calcolato con computed
  readonly todosVisibili = computed(() => {
    const lista = this.todoService.todos();
    return this.soloDaFare() ? lista.filter((t) => !t.completed) : lista;
  });

  ngOnInit(): void {
    this.todoService.caricaTodos();
  }

  aggiungi(input: HTMLInputElement): void {
    const titolo = input.value.trim();
    if (!titolo) return;

    this.todoService.aggiungiTodo(titolo);
    input.value = '';
  }
}
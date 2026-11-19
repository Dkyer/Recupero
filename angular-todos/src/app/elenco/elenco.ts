import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TodoService } from '../services/todo-service';

@Component({
  selector: 'app-elenco',
  imports: [RouterLink],
  templateUrl: './elenco.html',
  styleUrl: './elenco.css'
})
export class Elenco implements OnInit {
  // Collega il servizio per leggere i signal e chiamare GET / POST
  readonly todoService = inject(TodoService);

  // Conteggio calcolato automaticamente con computed quando cambia la lista
  readonly totaleTodos = computed(() => this.todoService.todos().length);

  // Appena la pagina si apre, carica i 100 todo
  ngOnInit(): void {
    this.todoService.caricaTodos();
  }

  // Legge il testo dall'input e chiama la POST nel servizio
  aggiungi(input: HTMLInputElement): void {
    const titolo = input.value.trim();
    if (!titolo) return;

    this.todoService.aggiungiTodo(titolo);
    input.value = '';
  }
}

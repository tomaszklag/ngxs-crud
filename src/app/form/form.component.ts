import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TodoState } from '../state/todo.state';
import { Observable, Subscription } from 'rxjs';
import { Todo } from '../models/Todo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UpdateTodo, SetSelectedTodo, AddTodo } from '../actions/todo.action';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit, OnDestroy {

  @Select(TodoState.getSelectedTodo) selectedTodo: Observable<Todo>;
  todoForm: FormGroup;
  editedTodo = false;
  private _selectedTodoSub = new Subscription();

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) { }

  ngOnInit() {
    this.createTodoFormGroup();
    this.listenToSelectedTodo();
  }

  onSubmit() {
    if (this.editedTodo) {
      this.store.dispatch(new UpdateTodo(this.todoForm.value, this.todoForm.value.id))
        .pipe(first())
        .subscribe(() => {
          this.todoForm.reset();
          this.store.dispatch(new SetSelectedTodo(null));
        });
    } else {
      this.store.dispatch(new AddTodo(this.todoForm.value))
        .pipe(first())
        .subscribe(() => {
          this.todoForm.reset();
        });
    }
  }

  private createTodoFormGroup(): void {
    this.todoForm = this.fb.group({
      id: [''],
      userId: ['', Validators.required],
      title: ['', Validators.required]
    });
  }

  private listenToSelectedTodo(): void {
    this._selectedTodoSub = this.selectedTodo
      .subscribe((todo: Todo) => {
        if (todo) {
          this.todoForm.patchValue({
            id: todo.id,
            userId: todo.userId,
            title: todo.title
          });
          this.editedTodo = true;
        } else {
          this.editedTodo = false;
        }
      });
  }

  ngOnDestroy(): void {
    this._selectedTodoSub.unsubscribe();
  }
}

import { Todo } from '../models/Todo';

export class AddTodo {
  static readonly type = '[TODO] Add';

  constructor(public payload: Todo) {}
}

export class GetTodos {
  static readonly type = '[TODO] Get';
}

export class UpdateTodo {
  static readonly type = '[TODO] Update';

  constructor(
    public payload: Todo,
    public id: number
  ) {}
}

export class DeleteTodo {
  static readonly type = '[TODO] Delete';

  constructor(public id: number) {}
}

export class SetSelectedTodo {
  static readonly type = '[TODO] Set';

  constructor(public payload: Todo) {}
}

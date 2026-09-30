"use client";

import { FormEvent, KeyboardEvent, useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");

  // Add Todo
  const addTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    };

    setTodos((prev) => [...prev, newTodo]);
    setInput("");
  };

  // Delete Todo
  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // Toggle Todo
  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  // Start Editing
  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  // Update Todo
  const updateTodo = (id: number) => {
    if (!editText.trim()) return;

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, text: editText.trim() }
          : todo
      )
    );

    setEditingId(null);
    setEditText("");
  };

  // Handle keyboard shortcuts while editing
  const handleEditKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    if (e.key === "Enter") {
      updateTodo(id);
    }

    if (e.key === "Escape") {
      setEditingId(null);
      setEditText("");
    }
  };

  const completedCount: number = todos.filter(
    (todo) => todo.completed
  ).length;

  return (
    <main className="min-h-screen bg-[#f5f6f8] px-5 py-12 text-[#202124] sm:py-20">
      <div className="mx-auto w-full max-w-2xl">

        {/* Header */}
        <header className="mb-8 flex items-start justify-between">
          <div>
            <p className="mb-2 text-xs font-bold tracking-[0.18em] text-violet-500">
              MY DAY
            </p>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Todo List
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Keep things simple and get things done.
            </p>
          </div>

          {/* Completed Counter */}
          <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
            <span className="text-lg font-bold">
              {completedCount}
            </span>

            <span className="text-[10px] text-gray-400">
              done
            </span>
          </div>
        </header>

        {/* Add Todo */}
        <form
          onSubmit={addTodo}
          className="mb-6 flex gap-2"
        >
          <input
            type="text"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-13 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          />

          <button
            type="submit"
            className="h-13 rounded-xl bg-violet-500 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-600"
          >
            Add
          </button>
        </form>

        {/* Todo List */}
        <div className="space-y-2">
          {todos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-violet-50 text-lg font-bold text-violet-500">
                ✓
              </div>

              <h3 className="text-sm font-semibold">
                You're all caught up
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Add a task above to get started.
              </p>
            </div>
          ) : (
            todos.map((todo: Todo) => (
              <div
                key={todo.id}
                className={`group flex min-h-16 items-center gap-3 rounded-xl border bg-white px-3 py-2 transition hover:-translate-y-px hover:shadow-sm ${
                  todo.completed
                    ? "border-gray-100"
                    : "border-gray-200"
                }`}
              >
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md border text-xs font-bold transition ${
                    todo.completed
                      ? "border-violet-500 bg-violet-500 text-white"
                      : "border-gray-300 bg-white hover:border-violet-400"
                  }`}
                  aria-label="Toggle todo"
                >
                  {todo.completed && "✓"}
                </button>

                {/* Todo Text / Edit Input */}
                {editingId === todo.id ? (
                  <input
                    autoFocus
                    type="text"
                    value={editText}
                    onChange={(e) =>
                      setEditText(e.target.value)
                    }
                    onKeyDown={(e) =>
                      handleEditKeyDown(e, todo.id)
                    }
                    className="min-w-0 flex-1 border-b border-violet-500 bg-transparent py-1 text-sm outline-none"
                  />
                ) : (
                  <span
                    className={`min-w-0 flex-1 break-words text-sm ${
                      todo.completed
                        ? "text-gray-400 line-through"
                        : "text-gray-700"
                    }`}
                  >
                    {todo.text}
                  </span>
                )}

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
                  {editingId === todo.id ? (
                    <button
                      type="button"
                      onClick={() => updateTodo(todo.id)}
                      className="rounded-lg px-2 py-1.5 text-xs font-semibold text-violet-500 hover:bg-violet-50"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEdit(todo)}
                      className="rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteTodo(todo.id)}
                    className="rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-400 hover:bg-red-50 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {todos.length > 0 && (
          <footer className="mt-4 flex justify-between px-1 text-xs text-gray-400">
            <span>
              {todos.length}{" "}
              {todos.length === 1 ? "task" : "tasks"}
            </span>

            <span>{completedCount} completed</span>
          </footer>
        )}
      </div>
    </main>
  );
}


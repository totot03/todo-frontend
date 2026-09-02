"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Todo } from "@/types/api";
import { TodoListItem } from "./TodoListItem";

/** 목록 진입/삭제 애니메이션(FR-U07, 150~250ms). 토글은 여기가 아니라 각 행의 opacity 전환으로 처리한다. */
export function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <ul className="flex flex-col gap-2">
      <AnimatePresence initial={false}>
        {todos.map((todo) => (
          <motion.li
            key={todo.id}
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TodoListItem todo={todo} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

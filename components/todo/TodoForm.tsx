"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { extractErrorMessage, extractFieldErrors } from "@/lib/api/errors";
import { todoFormDefaultValues, todoFormSchema, type TodoFormValues } from "@/lib/schemas/todo";

interface TodoFormProps {
  defaultValues?: Partial<TodoFormValues>;
  /** 실패 시 reject하는 mutateAsync를 그대로 넘기면 이 폼이 필드 에러 매핑까지 처리한다. */
  onSubmit: (values: TodoFormValues) => Promise<unknown>;
  isPending: boolean;
  submitLabel: string;
  onCancel: () => void;
}

/** 작성(/todos/new)·편집(/todos/[id]) 양쪽에서 재사용하는 공용 폼(FR-T01~T04, T09). */
export function TodoForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel,
  onCancel,
}: TodoFormProps) {
  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: { ...todoFormDefaultValues, ...defaultValues },
  });

  async function handleSubmit(values: TodoFormValues) {
    try {
      await onSubmit(values);
    } catch (err) {
      const fieldErrors = extractFieldErrors(err);
      if (fieldErrors) {
        fieldErrors.forEach(({ field, message }) => {
          if (field in todoFormDefaultValues) {
            form.setError(field as keyof TodoFormValues, { message });
          }
        });
        return;
      }
      form.setError("root", { message: extractErrorMessage(err) });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4" noValidate>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input placeholder="할 일을 입력하세요" maxLength={200} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-4 sm:flex-row">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>마감일</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>우선순위</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="HIGH">높음</SelectItem>
                    <SelectItem value="MEDIUM">보통</SelectItem>
                    <SelectItem value="LOW">낮음</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm leading-none font-medium">설명</span>
          {/* Tiptap은 네이티브 input이 아니므로 shadcn FormField 대신 Controller로 직접 연결한다. */}
          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <TiptapEditor content={field.value ?? ""} onChange={field.onChange} />
            )}
          />
        </div>

        {form.formState.errors.root && (
          <ErrorMessage message={form.formState.errors.root.message ?? ""} />
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "저장 중..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

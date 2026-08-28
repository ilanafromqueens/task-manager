"use client";

import { useCallback, useMemo, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import TaskFilters from "@/components/TaskFilters";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import TaskSearch from "@/components/TaskSearch";
import StyleEditor from "@/components/StyleEditor";
import ThemeToggle from "@/components/ThemeToggle";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useTasks } from "@/hooks/useTasks";
import { filterTasks, searchTasks, type TaskFilter } from "@/lib/utils";

export default function Home() {
  const {
    tasks,
    lastAddedId,
    isLoading,
    isSaving,
    handleAdd,
    handleToggle,
    handleDelete,
    handleEdit,
  } = useTasks();

  const [activeFilter, setActiveFilter] = useState<TaskFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

  const filterOnlyTasks = useMemo(
    () => filterTasks(tasks, activeFilter),
    [tasks, activeFilter],
  );

  const filteredTasks = useMemo(
    () => searchTasks(filterOnlyTasks, debouncedSearchQuery),
    [filterOnlyTasks, debouncedSearchQuery],
  );

  const handleClearSearch = useCallback(() => setSearchQuery(""), []);

  const handleFilterChange = useCallback(
    (filter: TaskFilter) => setActiveFilter(filter),
    [],
  );

  const handleSearchChange = useCallback(
    (query: string) => setSearchQuery(query),
    [],
  );

  const isSearching =
    searchQuery.trim() !== debouncedSearchQuery.trim() && searchQuery.trim() !== "";

  return (
    <div className="app-root flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-6 py-12">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-text-heading">
              Task Manager
            </h1>
            <p className="mt-1 text-sm text-text-label">
              Create and track your tasks.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <StyleEditor />
            <ThemeToggle />
          </div>
        </header>

        {isSaving && !isLoading && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-text-body dark:border-zinc-800 dark:bg-zinc-900"
          >
            <LoadingSpinner label="Saving changes" size="sm" />
            <span>Saving changes...</span>
          </div>
        )}

        <TaskForm
          onAdd={handleAdd}
          isTaskListEmpty={!isLoading && tasks.length === 0}
          isSaving={isSaving}
        />

        <section
          aria-label="Task filters and list"
          className="flex flex-col gap-4"
        >
          <TaskFilters
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />

          <TaskSearch
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClear={handleClearSearch}
            isSearching={isSearching}
          />

          <TaskList
            tasks={filteredTasks}
            lastAddedId={lastAddedId}
            filterOnlyCount={filterOnlyTasks.length}
            activeFilter={activeFilter}
            searchQuery={debouncedSearchQuery}
            isLoading={isLoading}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
}

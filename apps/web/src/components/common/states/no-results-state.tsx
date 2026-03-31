import { SearchX } from 'lucide-react';
import { EmptyState } from './empty-state';

type NoResultsStateProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

export function NoResultsState({
  title = 'No results found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  action,
}: NoResultsStateProps) {
  return (
    <EmptyState
      icon={<SearchX className="h-10 w-10" />}
      title={title}
      description={description}
      action={action}
    />
  );
}

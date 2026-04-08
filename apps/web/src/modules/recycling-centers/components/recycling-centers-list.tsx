import {
  RecyclingCenterCard,
  type RecyclingCenter,
} from '@/modules/recycling-centers';

type RecyclingCentersListProps = {
  centers: RecyclingCenter[];
};

export function RecyclingCentersList({ centers }: RecyclingCentersListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {centers.map((center) => (
        <RecyclingCenterCard key={center.id} center={center} />
      ))}
    </div>
  );
}

'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export function DialogDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>

      <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>
        Open Confirmation
      </Button>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit location"
        description="Update the recycling center details below."
      >
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Your form content goes here.
          </p>

          <div className="flex justify-end gap-3">
            <Button variant='primary' onClick={() => setIsModalOpen(false)}>Done</Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Done</Button>
          </div>
        </div>
      </Modal>

      <ConfirmationDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          console.log('Confirmed');
          setIsConfirmOpen(false);
        }}
        title="Delete location"
        description="This action cannot be undone. This will permanently remove the selected record."
        confirmLabel="Delete"
        cancelLabel="Keep Record"
        variant="danger"
      />
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import Modal from '@/components/common/Modal';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (event: { name: string; description: string; date: string }) => void;
}

const EventModal: React.FC<EventModalProps> = ({isOpen, onClose}) => {


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="mx-6">
                <h3 className="text-md font-medium text-center mb-6">Select Event Type</h3>

                {/* Event Type Buttons */}
                <div className="flex-col flex justify-center space-y-3">
                    <Link href="/time-diary/future">

                        <button
                            className='w-full px-6 py-2 rounded-full bg-primary text-white'
                        >
                            Future
                        </button>
                    </Link>

                    <Link href="/time-diary/past">
                        <button

                            className='w-full px-6  py-2 rounded-full bg-gray-100 text-gray-700'
                        >
                            Past
                        </button>
                    </Link>
                </div>


            </div>
        </Modal>
    );
};

export default EventModal;

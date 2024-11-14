import React from 'react';

interface ConfirmDialogProps {
    message: string;
    secMessage?: string;
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ message, secMessage, isOpen, onCancel, onConfirm }) => {
    if (isOpen)
        return (
            <div
                className="fixed  inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            >
                <div
                    className="bg-card p-6 border-gray-600 border-2 rounded-lg shadow-lg w-80"
                >
                    <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                        {message}
                    </h3>

                    <h4 className="text-sm text-red-400 opacity-75]">
                        {secMessage}
                    </h4>
                    <div className="mt-4 flex justify-end">
                        <button
                            className="bg-muted text-muted-foreground py-2 px-4 rounded-lg mr-2"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] py-2 px-4 rounded-lg"
                            onClick={onConfirm}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        );
};

export default ConfirmDialog;

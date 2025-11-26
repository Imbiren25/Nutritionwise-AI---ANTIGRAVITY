
import React from 'react';
import { useStockInventory } from '../hooks/useStockInventory';
import StockInventoryStepper from './StockInventoryStepper';

const StockInventory: React.FC = () => {
    // FIX: The useStockInventory hook requires props for notifications.
    // Provided dummy functions to resolve the error.
    const stockInventoryHook = useStockInventory({ addNotification: () => {}, showSnackbar: () => {} });

    const handleReset = () => {
        stockInventoryHook.reset();
        // Here you might want to navigate back to home, which would require passing a function from App.tsx
        // For now, it just resets the state for a new inventory.
    }

    return (
        // FIX: Replaced incorrect 'resetInventory' prop with 'onFinish' and added missing 'onExit' prop.
        <StockInventoryStepper 
            inventoryHook={stockInventoryHook} 
            onFinish={handleReset} 
            onExit={() => {}}
            // FIX: Add the missing 'showSnackbar' prop to satisfy StockInventoryStepper's required props.
            showSnackbar={() => {}}
        />
    );
};

export default StockInventory;
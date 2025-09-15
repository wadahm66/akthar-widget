import { useContext } from 'react';
import { WidgetContext } from '../lib/context';
import UniversalBundleTemplate from './UniversalBundleTemplate';

export function Widget() {
  const { isOpen, setIsOpen } = useContext(WidgetContext);

  if (!isOpen) {
    return (
      <button className='widget-button' onClick={() => setIsOpen(true)}>
        Open Widget
      </button>
    );
  }

  return (
    <div className='widget-container'>
      <div className='widget-header'>
        <h3>Widget Title</h3>
        <button onClick={() => setIsOpen(false)}>Close</button>
      </div>

      <div className='widget-content'>
        {/* Your widget content goes here */}
        <UniversalBundleTemplate />
      </div>
    </div>
  );
}

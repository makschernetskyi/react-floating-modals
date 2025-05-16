import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState
  } from 'react';
  
  /* ------------------------------------------------------------------ */
  /* Types                                                              */
  /* ------------------------------------------------------------------ */
  
  export interface FloatingModalProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag'> {
    /** starting left position (px) or `"center"` */
    initialX?: number | 'center';
    /** starting top position (px) or `"center"` */
    initialY?: number | 'center';
    /** CSS selector (relative) that marks the drag handle */
    handleSelector?: string;
    /** fires on every pointer‐move */
    onDrag?: (coords: { x: number; y: number }) => void;
  }
  
  export interface FloatingModalHandle {
    /** programmatically move to specific coordinates */
    resetPosition: (x?: number | 'center', y?: number | 'center') => void;
  }
  
  /* ------------------------------------------------------------------ */
  /* Component                                                          */
  /* ------------------------------------------------------------------ */
  
  const FloatingModal = forwardRef<FloatingModalHandle, FloatingModalProps>(
    (
      {
        initialX = 'center',
        initialY = 'center',
        handleSelector = '[data-drag-handle]',
        onDrag,
        style,
        className,
        children,
        ...rest
      },
      ref
    ) => {
      const modalRef = useRef<HTMLDivElement>(null);
      const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
      const dragState = useRef<{
        dragging: boolean;
        offsetX: number;
        offsetY: number;
      }>({ dragging: false, offsetX: 0, offsetY: 0 });
  
      /* ------------------------------------------------------------------ */
      /* Initial position (centre or explicit numbers)                      */
      /* ------------------------------------------------------------------ */
      useLayoutEffect(() => {
        if (!modalRef.current) return;
  
        const { width, height } = modalRef.current.getBoundingClientRect();
  
        const x =
          initialX === 'center'
            ? (window.innerWidth - width) / 2
            : (initialX as number);
        const y =
          initialY === 'center'
            ? (window.innerHeight - height) / 2
            : (initialY as number);
  
        setPos({ x, y });
      }, [initialX, initialY]);
  
      /* ------------------------------------------------------------------ */
      /* Imperative API                                                     */
      /* ------------------------------------------------------------------ */
      useImperativeHandle(ref, () => ({
        resetPosition: (x = initialX, y = initialY) => {
          const { width, height } = modalRef.current!.getBoundingClientRect();
          setPos({
            x: x === 'center' ? (window.innerWidth - width) / 2 : (x as number),
            y: y === 'center' ? (window.innerHeight - height) / 2 : (y as number)
          });
        }
      }));
  
      /* ------------------------------------------------------------------ */
      /* Pointer handlers                                                   */
      /* ------------------------------------------------------------------ */
      const pointerDown = useCallback((e: PointerEvent) => {
        if (e.button !== 0) return; // left-click only
        const rect = modalRef.current!.getBoundingClientRect();
  
        dragState.current = {
          dragging: true,
          offsetX: e.clientX - rect.left,
          offsetY: e.clientY - rect.top
        };
        (e.target as Element).setPointerCapture(e.pointerId);
      }, []);
  
      const pointerMove = useCallback(
        (e: PointerEvent) => {
          if (!dragState.current.dragging) return;
          const next = {
            x: e.clientX - dragState.current.offsetX,
            y: e.clientY - dragState.current.offsetY
          };
          setPos(next);
          onDrag?.(next);
        },
        [onDrag]
      );
  
      const pointerUp = useCallback((e: PointerEvent) => {
        dragState.current.dragging = false;
        (e.target as Element).releasePointerCapture(e.pointerId);
      }, []);
  
      /* ------------------------------------------------------------------ */
      /* Attach / detach listeners                                          */
      /* ------------------------------------------------------------------ */
      useEffect(() => {
        const handle =
          (modalRef.current?.querySelector(handleSelector) as HTMLElement) ??
          modalRef.current!;
        handle.style.cursor = 'move';
  
        handle.addEventListener('pointerdown', pointerDown);
        handle.addEventListener('pointermove', pointerMove);
        handle.addEventListener('pointerup', pointerUp);
  
        return () => {
          handle.removeEventListener('pointerdown', pointerDown);
          handle.removeEventListener('pointermove', pointerMove);
          handle.removeEventListener('pointerup', pointerUp);
        };
      }, [handleSelector, pointerDown, pointerMove, pointerUp]);
  
      /* ------------------------------------------------------------------ */
      /* Render                                                             */
      /* ------------------------------------------------------------------ */
      return (
        <div
          ref={modalRef}
          className={className}
          style={{
            position: 'fixed',
            left: pos.x,
            top: pos.y,
            touchAction: 'none',
            userSelect: 'none',
            ...style
          }}
          {...rest}
        >
          {children}
        </div>
      );
    }
  );
  
  FloatingModal.displayName = 'FloatingModal';
  export {FloatingModal};
  
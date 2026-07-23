import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styled from "styled-components";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import trainNetwork from "../helper/TrainNetwork";

/* ─── Styled components ─────────────────────────────────────────────────── */

const MAP_VIEWBOX = {
  width: 793.70135,
  height: 1122.52,
};

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(23, 20, 17, 0.45);
  z-index: 1999;
`;

const Drawer = styled(motion.div)`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  width: min(100%, 600px);
  height: min(88dvh, 720px);
  background: #ffffff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.18);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom, 0px);
`;

const DragZone = styled.div`
  flex-shrink: 0;
  touch-action: none;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`;

const Handle = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 999px;
  background: #d9d9d9;
  margin: 10px auto 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px 8px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111;
`;

const DoneButton = styled.button`
  border: none;
  background: none;
  color: #f6891f;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 4px;
  &:hover {
    color: #e07b1f;
  }
`;

const MapViewport = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: #e8e0d5;
`;

const MapContent = styled.div`
  position: relative;
  width: ${MAP_VIEWBOX.width}px;
  height: ${MAP_VIEWBOX.height}px;

  & > div:first-child {
    width: 100%;
    height: 100%;
  }
  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;
const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 8px 20px 12px;
  flex-shrink: 0;
  font-size: 12px;
  color: #555;
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  border: 1.5px solid rgba(0,0,0,0.12);
  flex-shrink: 0;
`;

/* ─── Constants ─────────────────────────────────────────────────────────── */

const DISMISS_VELOCITY = 500;
const SNAP_BACK_THRESHOLD = 0.45;

let cachedSvg = null;
let savedTransform = null;

const DEFAULT_TRANSFORM = { scale: 1.8, positionX: -180, positionY: -120 };

/* ─── Sub-components ────────────────────────────────────────────────────── */

const SvgHost = React.memo(({ html }) => (
  <div
    style={{ width: "100%", height: "100%" }}
    dangerouslySetInnerHTML={{ __html: html }}
  />
));

/* ─── Main component ────────────────────────────────────────────────────── */

const Hint = ({ isOpen, onClose }) => {
  const dragControls = useDragControls();
  const [svgContent, setSvgContent] = useState(cachedSvg);
  const transformRef = useRef(null);
  const drawerRef = useRef(null);

  const viewportRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!isOpen) return;
    const el = viewportRef.current;
    if (!el) return;

    const measure = () => setContainerSize({ width: el.clientWidth, height: el.clientHeight });
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);

  const coverFit = useMemo(() => {
    if (!containerSize.width || !containerSize.height) return null;
    const scale = Math.max(
      containerSize.width / MAP_VIEWBOX.width,
      containerSize.height / MAP_VIEWBOX.height
    );
    const scaledWidth = MAP_VIEWBOX.width * scale;
    const scaledHeight = MAP_VIEWBOX.height * scale;
    return {
      scale,
      positionX: (containerSize.width - scaledWidth) / 2,
      positionY: (containerSize.height - scaledHeight) / 2,
    };
  }, [containerSize]);

  useEffect(() => {
    if (cachedSvg) return;
    fetch("/Maps/map.svg")
      .then((r) => r.text())
      .then((text) => {
        cachedSvg = text;
        setSvgContent(text);
      });
  }, []);

  // Restore saved transform when drawer opens
  useEffect(() => {
    if (!isOpen || !transformRef.current || !coverFit) return;
    const t = savedTransform ?? coverFit;
    const id = setTimeout(() => {
      transformRef.current?.setTransform(t.positionX, t.positionY, t.scale, 0);
    }, 60);
    return () => clearTimeout(id);
  }, [isOpen, coverFit]);

  const stableSvg = useMemo(() => svgContent ?? "", [svgContent]);

  const startSheetDrag = useCallback(
    (e) => dragControls.start(e),
    [dragControls]
  );

  const handleDragEnd = useCallback(
    (_, info) => {
      const drawerEl = drawerRef.current;
      const drawerHeight = drawerEl ? drawerEl.getBoundingClientRect().height : 600;
      const draggedPastThreshold = info.offset.y > drawerHeight * SNAP_BACK_THRESHOLD;
      const fastFlick = info.velocity.y > DISMISS_VELOCITY;

      if (draggedPastThreshold || fastFlick) {
        onClose();
      }
      // Otherwise framer snaps back via dragConstraints
    },
    [onClose]
  );

  const handleTransformChange = useCallback(({ state }) => {
    savedTransform = {
      scale: state.scale,
      positionX: state.positionX,
      positionY: state.positionY,
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />

          <Drawer
            ref={drawerRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 340 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 1 }}
            onDragEnd={handleDragEnd}
          >
            <DragZone onPointerDown={startSheetDrag}>
              <Handle />
              <Header>
                <Title>Network Map</Title>
                <DoneButton type="button" onClick={onClose}>Done</DoneButton>
              </Header>
            </DragZone>

            <MapViewport ref={viewportRef}>
              {coverFit && (
                <TransformWrapper
                  ref={transformRef}
                  initialScale={coverFit.scale}
                  initialPositionX={coverFit.positionX}
                  initialPositionY={coverFit.positionY}
                  minScale={coverFit.scale}
                  maxScale={10}
                  wheel={{ step: 0.25 }}
                  pinch={{ step: 5 }}
                  limitToBounds
                  centerOnInit={false}
                  onTransformed={handleTransformChange}
                  alignmentAnimation={{ disabled: true }}
                  velocityAnimation={{ disabled: true }}
                  panning={{ velocityDisabled: true }}
                >
                  <TransformComponent
                    wrapperStyle={{ width: "100%", height: "100%" }}
                    contentStyle={{ width: `${MAP_VIEWBOX.width}px`, height: `${MAP_VIEWBOX.height}px` }}
                  >
                    <MapContent>
                      <SvgHost html={stableSvg} />
                    </MapContent>
                  </TransformComponent>
                </TransformWrapper>
              )}
            </MapViewport>
          </Drawer>
        </>
      )}
    </AnimatePresence>
  );
};

export default Hint;
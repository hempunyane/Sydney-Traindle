// hint.jsx
import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styled from "styled-components";

const MapOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MapContainer = styled.div`
  position: relative;
  width: 95%;
  height: 95%;
  background: white;
  border-radius: 10px;
  padding: 10px;
  overflow: hidden; /* Critical: prevents content from overflowing */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f6891f;
  border: none;
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2001;
  
  &:hover {
    background-color: #e07b1f;
  }
`;

const MapImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block; /* Removes any extra spacing */
`;

// Wrapper to constrain the transform component
const TransformWrapperStyled = styled(TransformWrapper)`
  width: 100%;
  height: 100%;
`;

const TransformComponentStyled = styled(TransformComponent)`
  width: 100%;
  height: 100%;
  
  /* The transform component creates a div, we need to constrain it */
  div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Hint = ({ isOpen, onOpen, onClose }) => {
	const openedRef = React.useRef(false);

    React.useEffect(() => {
        if (isOpen && !openedRef.current) {
            openedRef.current = true;
            onOpen();
        }

        if (!isOpen) {
            openedRef.current = false;
        }
    }, [isOpen, onOpen]);

    if (!isOpen) return null;
	
    return (
        <MapOverlay onClick={onClose}>
            <MapContainer onClick={(e) => e.stopPropagation()}>
                <TransformWrapper
                    initialScale={1}
                    minScale={1}
                    maxScale={5}
                    wheel={{ step: 0.1 }}
                    pinch={{ step: 0.1 }}
                    // Add these options to constrain panning
                    limitToBounds={true} // Keeps content within bounds
                    centerOnInit={true} // Centers the image initially
                    minPositionX={null} // Let the library handle bounds
                    maxPositionX={null}
                    minPositionY={null}
                    maxPositionY={null}
                >
                    <TransformComponentStyled
                        wrapperStyle={{
                            width: "100%",
                            height: "100%",
                            overflow: "hidden", // Double ensure no overflow
                        }}
                    >
                        <MapImage src="./Maps/map-old.png" alt="Train Network Map" />
                    </TransformComponentStyled>
                </TransformWrapper>
                <CloseButton onClick={onClose}>
                    <i className="bi bi-x-lg"></i>
                </CloseButton>
            </MapContainer>
        </MapOverlay>
    );
};

export default Hint;
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
  overflow: hidden;
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

const SvgContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

let cachedSvg = null;

const Hint = ({ isOpen, onClose }) => {
    const [svgContent, setSvgContent] = React.useState(cachedSvg);

    React.useEffect(() => {
        if (cachedSvg) return;
        fetch("/Maps/map.svg")
            .then((r) => r.text())
            .then((text) => {
                cachedSvg = text;
                setSvgContent(text);
            });
    }, []);

    if (!isOpen) return null;

    return (
        <MapOverlay onClick={onClose}>
            <MapContainer onClick={(e) => e.stopPropagation()}>
                <TransformWrapper
                    initialScale={1}
                    minScale={1}
                    maxScale={5}
                    wheel={{ step: 0.3 }}
                    pinch={{ step: 0.3 }}
                    limitToBounds={true}
                    centerOnInit={true}
                >
                    <TransformComponent
                        wrapperStyle={{ width: "100%", height: "100%", overflow: "hidden" }}
                    >
                        <SvgContainer dangerouslySetInnerHTML={{ __html: svgContent ?? "" }} />
                    </TransformComponent>
                </TransformWrapper>
                <CloseButton onClick={onClose}>
                    <i className="bi bi-x-lg"></i>
                </CloseButton>
            </MapContainer>
        </MapOverlay>
    );
};

export default Hint;

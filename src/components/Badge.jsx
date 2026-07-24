import styled, { keyframes } from 'styled-components';

//Some settings u can mess with if u needa tweak stuff
//Also take note of the props u can toggle off certain stuff when needed
const BADGE_SIZE = 60;
const RIBBON_WIDTH = BADGE_SIZE * 0.6;
const RIBBON_OFFSET = BADGE_SIZE * -0.05;
const RIBBON_DROP = BADGE_SIZE * 0.5;

const shimmerAnimation = keyframes`
    0%, 60% {
        transform: translate(-160%, -160%) rotate(-45deg);
    }
    100% {
        transform: translate(160%, 160%) rotate(-45deg);
    }
`;

const BadgeContainer = styled.div`
    position: relative;
    width: ${BADGE_SIZE}px;
    height: ${BADGE_SIZE}px;
    overflow: visible;
    filter: ${({ $saturate }) => ($saturate ? 'none' : 'saturate(0)')};
    transition: filter 0.2s ease;
    cursor: pointer;
`;

const Ribbon = styled.img`
    position: absolute;
    width: ${RIBBON_WIDTH}px;
    height: auto;
    bottom: -${RIBBON_DROP}px;
    z-index: -1;
    pointer-events: none;
    user-select: none;
`;

const LeftRibbon = styled(Ribbon)`
    left: ${RIBBON_OFFSET}px;
    transform: scaleX(-1);
`;

const RightRibbon = styled(Ribbon)`
    right: ${RIBBON_OFFSET}px;
`;

const BadgeCircle = styled.div`
    position: relative;
    width: ${BADGE_SIZE}px;
    height: ${BADGE_SIZE}px;
    border-radius: 50%;
    background-color: #f6891f;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    z-index: 1;
`;

const Shimmer = styled.div`
    position: absolute;
    width: ${BADGE_SIZE * 2}px;
    height: 20px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.85), transparent);
    opacity: .7;
    animation: ${shimmerAnimation} 5s linear infinite;
    z-index: 1;
`;

const BadgeIcon = styled.img`
    position: relative;
    z-index: 2;
    width: 60%;
    height: 60%;
    object-fit: contain;
    user-select: none;
    pointer-events: none;
`;

function Badge({
    badgeIcon,
    ribbonIcon = "public/Icons/ribbon.svg",
    saturate = true,
    onHoverChange = () => {},
}) {
    return (
        <BadgeContainer
            $saturate={saturate}
            onMouseEnter={() => onHoverChange(true)}
            onClick={() => onHoverChange(true)}
        >
            {ribbonIcon && (
                <>
                    <LeftRibbon src={ribbonIcon} alt="" />
                    <RightRibbon src={ribbonIcon} alt="" />
                </>
            )}
            <BadgeCircle>
                <Shimmer />
                <BadgeIcon src={badgeIcon} alt="" />
            </BadgeCircle>
        </BadgeContainer>
    );
}

export default Badge;
export enum Segment {
    HEAD,
    HEAD_LEFT,
    HEAD_RIGHT,
    STRAIGHT,
    TURN_LEFT,
    TURN_RIGHT,
    TAIL,
    TAIL_LEFT,
    TAIL_RIGHT
}

export type HeadSegment = Segment.HEAD | Segment.HEAD_LEFT | Segment.HEAD_RIGHT;
export type BodySegment = Segment.STRAIGHT | Segment.TURN_LEFT | Segment.TURN_RIGHT;
export type TailSegment = Segment.TAIL | Segment.TAIL_LEFT | Segment.TAIL_RIGHT;

export type SnakeSettings = {
    length: number
}
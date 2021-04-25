export class TimeControlSettings {
  enabled = false;

  items: {
    accelerateTime: {
      enabled: boolean;
      subTrigger: number;
    };
    timeSkip: {
      enabled: boolean;
      subTrigger: number;
      maximum: number;
      spring: boolean;
      summer: boolean;
      autumn: boolean;
      winter: boolean;
    };
    reset: {
      enabled: boolean;
      subTrigger: number;
    };
  } = {
    accelerateTime: { enabled: true, subTrigger: 1 },
    timeSkip: {
      enabled: false,
      subTrigger: 5,
      autumn: false,
      summer: false,
      spring: true,
      maximum: 50,
      winter: false,
    },
    reset: {
      enabled: false,
      subTrigger: 99999,
    },
  };
}

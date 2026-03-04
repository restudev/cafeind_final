// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ApexOptions } from 'apexcharts';

declare module 'apexcharts' {
  interface ApexOptions {
    states?: {
      hover?: {
        filter?: {
          type?: string;
          value?: number;
        };
      };
      active?: {
        allowMultipleDataPointsSelection?: boolean;
        filter?: {
          type?: string;
          value?: number;
        };
      };
    };
  }
}

// Export to ensure module is processed
export {};
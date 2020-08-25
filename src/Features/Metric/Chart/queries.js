export const multiMeasureQuery = `
query($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
      value
      at
      unit
      metric
    }
  }
}
`;

export const subscriptionQuery = `
 subscription Measurement {
   newMeasurement {
     metric
     at
     value
     unit
   }
 }
 `;
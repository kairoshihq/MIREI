// backend/src/config/phase.js
export const PHASE = {
  ALPHA: 'alpha',
  BETA: 'beta',
  PRODUCTION: 'production'
};

export const currentPhase = PHASE.ALPHA;

export const isFeatureEnabled = (feature) => {
  const features = {
    feedback: false,
    metrics: true,
    cache: false
  };
  return features[feature] || false;
};
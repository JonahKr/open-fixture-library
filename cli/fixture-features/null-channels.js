module.exports = [{
  name: '`null` channels',
  description: 'Channel list of a mode contains null, so it has an unused channel',
  order: 30,
  hasFeature: fixture => fixture.modes.some(mode => mode.channelKeys.includes(null))
}];
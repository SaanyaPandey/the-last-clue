/**
 * Candidate Location Data Pool
 */

module.exports = [
  {
    id: 'location_grand_library',
    name: 'Grand Library',
    type: 'indoor',
    description: 'Towering mahogany bookcases, Persian rugs, and dim reading nooks.',
    compatibleWeapons: ['weapon_cyanide_vial', 'weapon_heavy_candlestick', 'weapon_ornate_dagger']
  },
  {
    id: 'location_greenhouse',
    name: 'Victorian Greenhouse',
    type: 'outdoor_enclosed',
    description: 'Humid glass conservatory filled with exotic orchids and iron potting tables.',
    compatibleWeapons: ['weapon_gardening_shears', 'weapon_cyanide_vial']
  },
  {
    id: 'location_wine_cellar',
    name: 'Subterranean Wine Cellar',
    type: 'underground',
    description: 'Cold cobblestone arches housing vintage casks and cobwebbed bottles.',
    compatibleWeapons: ['weapon_cyanide_vial', 'weapon_heavy_candlestick', 'weapon_ornate_dagger']
  },
  {
    id: 'location_private_study',
    name: 'Lord’s Private Study',
    type: 'indoor_secure',
    description: 'Heavy oak desk, wall safe concealed behind an oil portrait, and locked drawers.',
    compatibleWeapons: ['weapon_cyanide_vial', 'weapon_ornate_dagger', 'weapon_antique_pistol']
  },
  {
    id: 'location_conservatory',
    name: 'Glass Conservatory',
    type: 'indoor_glass',
    description: 'Marble statues, wicker furniture, and floor-to-ceiling garden views.',
    compatibleWeapons: ['weapon_silk_scarf', 'weapon_gardening_shears', 'weapon_heavy_candlestick']
  },
  {
    id: 'location_carriage_house',
    name: 'Carriage House',
    type: 'outbuilding',
    description: 'Smell of straw, motor oil, leather harnesses, and discarded iron tools.',
    compatibleWeapons: ['weapon_gardening_shears', 'weapon_heavy_candlestick', 'weapon_antique_pistol']
  },
  {
    id: 'location_drawing_room',
    name: 'Gilded Drawing Room',
    type: 'indoor_public',
    description: 'Plush velvet settees, marble fireplace, and tea service on a silver tray.',
    compatibleWeapons: ['weapon_silk_scarf', 'weapon_cyanide_vial', 'weapon_heavy_candlestick']
  }
];

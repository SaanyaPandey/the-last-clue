/**
 * Candidate Suspect Data Pool
 */

module.exports = [
  {
    id: 'suspect_lord_harrington',
    name: 'Lord Harrington',
    role: 'Aristocrat & Manor Owner',
    traits: ['arrogant', 'secretive', 'wealthy'],
    possibleMotives: ['motive_inheritance', 'motive_blackmail', 'motive_scandal'],
    accessLocations: ['location_grand_library', 'location_private_study', 'location_wine_cellar'],
    affiliatedWeapons: ['weapon_cyanide_vial', 'weapon_ornate_dagger', 'weapon_antique_pistol']
  },
  {
    id: 'suspect_eleanor_vance',
    name: 'Eleanor Vance',
    role: 'Estranged Niece & Heiress',
    traits: ['calculating', 'desperate', 'poised'],
    possibleMotives: ['motive_inheritance', 'motive_revenge', 'motive_financial_debt'],
    accessLocations: ['location_grand_library', 'location_conservatory', 'location_drawing_room'],
    affiliatedWeapons: ['weapon_cyanide_vial', 'weapon_silk_scarf', 'weapon_ornate_dagger']
  },
  {
    id: 'suspect_dr_sterling',
    name: 'Dr. Arthur Sterling',
    role: 'Family Physician',
    traits: ['meticulous', 'nervous', 'observant'],
    possibleMotives: ['motive_blackmail', 'motive_scandal', 'motive_professional_jealousy'],
    accessLocations: ['location_private_study', 'location_wine_cellar', 'location_grand_library'],
    affiliatedWeapons: ['weapon_cyanide_vial', 'weapon_ornate_dagger']
  },
  {
    id: 'suspect_thomas_finch',
    name: 'Thomas Finch',
    role: 'Head Grounds-Keeper & Gardener',
    traits: ['gruff', 'resentful', 'strong'],
    possibleMotives: ['motive_revenge', 'motive_financial_debt', 'motive_blackmail'],
    accessLocations: ['location_greenhouse', 'location_carriage_house', 'location_conservatory'],
    affiliatedWeapons: ['weapon_gardening_shears', 'weapon_heavy_candlestick']
  },
  {
    id: 'suspect_beatrice_thorne',
    name: 'Beatrice Thorne',
    role: 'Housekeeper of 30 Years',
    traits: ['loyal', 'silent', 'knows_all_secrets'],
    possibleMotives: ['motive_revenge', 'motive_scandal', 'motive_inheritance'],
    accessLocations: ['location_drawing_room', 'location_wine_cellar', 'location_grand_library'],
    affiliatedWeapons: ['weapon_silk_scarf', 'weapon_cyanide_vial', 'weapon_heavy_candlestick']
  },
  {
    id: 'suspect_julian_croft',
    name: 'Julian Croft',
    role: 'Shrewd Antiquities Dealer',
    traits: ['charming', 'deceitful', 'indebted'],
    possibleMotives: ['motive_financial_debt', 'motive_blackmail', 'motive_inheritance'],
    accessLocations: ['location_private_study', 'location_grand_library', 'location_carriage_house'],
    affiliatedWeapons: ['weapon_ornate_dagger', 'weapon_antique_pistol']
  },
  {
    id: 'suspect_vivienne_dubois',
    name: 'Vivienne Dubois',
    role: 'Visiting French Chanteuse',
    traits: ['dramatic', 'passionate', 'unpredictable'],
    possibleMotives: ['motive_professional_jealousy', 'motive_revenge', 'motive_scandal'],
    accessLocations: ['location_drawing_room', 'location_conservatory', 'location_grand_library'],
    affiliatedWeapons: ['weapon_silk_scarf', 'weapon_cyanide_vial']
  }
];

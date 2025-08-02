const materia = {
  name: 'FFXIV Materia',
  description: 'Monitor price trends for materia used in FFXIV content.',
  config: {
    region: 'NA',
    start_year: 2022,
    start_month: 1,
    start_day: 1,
    end_year: 2026,
    end_month: 5,
    end_day: 2,
    hq_only: false,
    price_setting: 'median',
    quantity_setting: 'quantitySold',
    price_groups: [
      {
        name: 'Strength',
        item_ids: [5604, 5605, 5606, 5607, 5608, 18006],
        categories: []
      },
      {
        name: 'Vitality',
        item_ids: [5609, 5610, 5611, 5612, 5613, 18007],
        categories: []
      },
      {
        name: 'Dexterity',
        item_ids: [5614, 5615, 5616, 5617, 5618, 18008],
        categories: []
      },
      {
        name: 'Intelligence',
        item_ids: [5619, 5620, 5621, 5622, 5623, 18009],
        categories: []
      },
      {
        name: 'Mind',
        item_ids: [5624, 5625, 5626, 5627, 5628, 18010],
        categories: []
      },
      {
        name: 'Piety',
        item_ids: [
          5629, 5630, 5631, 5632, 5633, 18011, 25186, 26727, 33917, 33930,
          41757, 41770
        ],
        categories: []
      },

      {
        name: 'Fire',
        item_ids: [5634, 5635, 5636, 5637, 5638, 18012],
        categories: []
      },
      {
        name: 'Ice',
        item_ids: [5639, 5640, 5641, 5642, 5643, 18013],
        categories: []
      },
      {
        name: 'Wind',
        item_ids: [5644, 5645, 5646, 5647, 5648, 18014],
        categories: []
      },
      {
        name: 'Earth',
        item_ids: [5649, 5650, 5651, 5652, 5653, 18015],
        categories: []
      },
      {
        name: 'Lightning',
        item_ids: [5654, 5655, 5656, 5657, 5658, 18016],
        categories: []
      },
      {
        name: 'Water',
        item_ids: [5659, 5660, 5661, 5662, 5663, 18017],
        categories: []
      },

      {
        name: "Heavens' Eye",
        item_ids: [
          5664, 5665, 5666, 5667, 5668, 18018, 25187, 26728, 33918, 33931,
          41758, 41771
        ],
        categories: []
      },
      {
        name: 'Savage Aim',
        item_ids: [
          5669, 5670, 5671, 5672, 5673, 18019, 25188, 26729, 33919, 33932,
          41759, 41772
        ],
        categories: []
      },
      {
        name: 'Savage Might',
        item_ids: [
          5674, 5675, 5676, 5677, 5678, 18020, 25189, 26730, 33920, 33933,
          41760, 41773
        ],
        categories: []
      },
      {
        name: 'Battledance',
        item_ids: [
          5679, 5680, 5681, 5682, 5683, 18021, 25190, 26731, 33921, 33934,
          41761, 41774
        ],
        categories: []
      },

      {
        name: "Gatherer's Guerdon",
        item_ids: [
          5684, 5685, 5686, 5687, 5688, 18022, 25191, 26732, 33922, 33935,
          41762, 41775
        ],
        categories: []
      },
      {
        name: "Gatherer's Guile",
        item_ids: [
          5689, 5690, 5691, 5692, 5693, 18023, 25192, 26733, 33923, 33936,
          41763, 41776
        ],
        categories: []
      },
      {
        name: "Gatherer's Grasp",
        item_ids: [
          5694, 5695, 5696, 5697, 5698, 18024, 25193, 26734, 33924, 33937,
          41764, 41777
        ],
        categories: []
      },

      {
        name: "Craftsman's Competence",
        item_ids: [
          5699, 5700, 5701, 5702, 5703, 18025, 25194, 26735, 33925, 33938,
          41765, 41778
        ],
        categories: []
      },
      {
        name: "Craftsman's Cunning",
        item_ids: [
          5704, 5705, 5706, 5707, 5708, 18026, 25195, 26736, 33926, 33939,
          41766, 41779
        ],
        categories: []
      },
      {
        name: "Craftsman's Command",
        item_ids: [
          5709, 5710, 5711, 5712, 5713, 18027, 25196, 26737, 33927, 33940,
          41767, 41780
        ],
        categories: []
      },

      {
        name: 'Quickarm',
        item_ids: [
          5714, 5715, 5716, 5717, 5718, 18028, 25197, 26738, 33928, 33941,
          41768, 41781
        ],
        categories: []
      },
      {
        name: 'Quicktongue',
        item_ids: [
          5719, 5720, 5721, 5722, 5723, 18029, 25198, 26739, 33929, 33942,
          41769, 41782
        ],
        categories: []
      }
    ]
  }
}

export default materia

const config = {
  chapters: [
    {
      id: 'step1',
      distance: '63.5',
      location: {
        center: [42.97983, 14.73442],
        zoom: 9.7,
        pitch: 40,
        bearing: 0
      },
      onChapterEnter: [
        {
          layer: 'route-1',
          opacity: 1
        }
      ],
      onChapterExit: [
        {
          layer: 'route-1',
          opacity: 0
        }
      ]
    },
    {
      id: 'step2',
      distance: '275.5',
      location: {
        center: [ 43.5815, 13.9194],
        zoom: 9,
        pitch: 60,
        bearing: 325
      },
      onChapterEnter: [
        {
          layer: 'route-2',
          opacity: 1
        }
      ],
      onChapterExit: [
        {
          layer: 'route-2',
          opacity: 0
        }
      ]
    },
    {
      id: 'step3',
      distance: '462',
      location: {
        center: [ 44.6, 13.0037],
        zoom: 8.9,
        pitch: 40,
        bearing: 314
      },
      onChapterEnter: [
        {
          layer: 'route-3',
          opacity: 1
        }
      ],
      onChapterExit: [
        {
          layer: 'route-3',
          opacity: 0
        }
      ]
    },
    {
      id: 'step4',
      distance: '462',
      location: {
        center: [ 45.01073, 12.79255],
        zoom: 13.34,
        pitch: 30,
        bearing: 30
      },
      // onChapterEnter: [
      //   {
      //     layer: 'route-4',
      //     opacity: 1
      //   }
      // ],
      // onChapterExit: [
      //   {
      //     layer: 'route-4',
      //     opacity: 0
      //   }
      // ]
    }
  ]
};

const config = {
  chapters: [
    {
      id: 'step1',
      distance: '63.5',
      duration: '4 days',
      location: {
        center: [42.97983, 14.73442],
        zoom: 9.7,
        pitch: 40,
        bearing: 0
      },
      paddingBottom: 100,
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
      duration: '4 days',
      location: {
        center: [ 43.6011, 13.7187],
        zoom: 9.3,
        pitch: 60,
        bearing: 320
      },
      paddingBottom: 150,
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
      duration: '7 days',
      location: {
        center: [ 44.5155, 13.0651],
        zoom: 8.6,
        pitch: 40,
        bearing: 314
      },
      paddingBottom: 350,
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
      duration: '3 years',
      location: {
        center: [ 45.0208, 12.7864],
        zoom: 14.5,
        pitch: 30,
        bearing: 40
      },
      paddingBottom: 350,
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

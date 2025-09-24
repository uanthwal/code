const basePageConfig = {
  pageId: 'page-001',
  name: 'Example Base Page',
  sections: [
    {
      sectionId: 'sec-1',
      name: 'Heterogenous Section',
      type: 'heterogenous',
      rank: 1,
      isCustomizable: true,
      x: 0, // position on parent page grid
      y: 0,
      w: 6,
      h: 20,
      widgets: [
        {
          widgetInstanceId: 'w1',
          id: 'widget-1',
          name: 'Hetero Widget 1',
          rank: 1,
          defaultSize: { h: 10, w: 5, minH: 10, minW: 5, maxH: 20, maxW: 10 },
          resizeHandles: 'e,w',
          removable: true
        },
        {
          widgetInstanceId: 'w2',
          id: 'widget-2',
          name: 'Hetero Widget 2',
          rank: 2,
          defaultSize: { h: 10, w: 5, minH: 10, minW: 5, maxH: 20, maxW: 10 },
          resizeHandles: 'n,s,e,w',
          removable: false
        }
      ]
    },
    {
      sectionId: 'sec-2',
      name: 'Homogenous Section',
      type: 'homogenous',
      rank: 2,
      isCustomizable: true,
      x: 0,
      y: 20,
      w: 12,
      h: 1,
      cellHeightPx: 320,
      cellWidthPx: 320,
      widgets: [
        {
          widgetInstanceId: 'w3',
          id: 'widget-3',
          name: 'Homo Widget 1',
          rank: 1,
          defaultSize: { h: 1, w: 1, minH: 1, minW: 1, maxH: 1, maxW: 1 },
          removable: true,
          resizeHandles: 'e,w'
        },
        {
          widgetInstanceId: 'w4',
          id: 'widget-4',
          name: 'Homo Widget 2',
          rank: 2,
          defaultSize: { h: 1, w: 1, minH: 1, minW: 1, maxH: 1, maxW: 1 },
          removable: true,
          resizeHandles: 'n,s'
        },
        {
          widgetInstanceId: 'w5',
          id: 'widget-5',
          name: 'Homo Widget 3',
          rank: 3,
          defaultSize: { h: 1, w: 1, minH: 1, minW: 1, maxH: 1, maxW: 1 },
          removable: false,
          resizeHandles: ''
        }
      ]
    }
  ]
};

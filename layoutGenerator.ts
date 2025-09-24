
import { PageConfig } from './types';

export class LayoutGenerator {
  generateLayout(pageConfig: PageConfig): PageConfig {
    const cloned: PageConfig = JSON.parse(JSON.stringify(pageConfig));
    cloned.sections.sort((a, b) => a.rank - b.rank);

    let currentY = 0;

    cloned.sections.forEach(section => {
      section.widgets.sort((a, b) => a.rank - b.rank);

      if (section.type === 'homogenous') {
        let currentX = 0;
        section.widgets.forEach(widget => {
          widget.w = widget.defaultSize.w;
          widget.h = widget.defaultSize.h;
          widget.minW = widget.defaultSize.minW;
          widget.minH = widget.defaultSize.minH;
          widget.maxW = widget.defaultSize.maxW;
          widget.maxH = widget.defaultSize.maxH;
          widget.x = currentX;
          widget.y = currentY;
          currentX += widget.w ?? 1;
        });
        currentY += section.widgets[0]?.h ?? 1;
      } else {
        section.widgets.forEach((widget, idx) => {
          widget.w = widget.defaultSize.w;
          widget.h = widget.defaultSize.h;
          widget.minW = widget.defaultSize.minW;
          widget.minH = widget.defaultSize.minH;
          widget.maxW = widget.defaultSize.maxW;
          widget.maxH = widget.defaultSize.maxH;
          widget.x = 0;
          widget.y = currentY + idx * (widget.h ?? 10);
        });
        currentY += section.widgets.reduce((acc, w) => acc + (w.h ?? 10), 0);
      }
    });

    return cloned;
  }
}


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
          widget.y = 0; // Relative to section grid
          currentX += widget.w ?? 1;
        });
        section.w = currentX; // Width of section block in parent page grid
        section.h = section.widgets[0]?.h ?? 1;
      } else {
        let sectionHeight = 0;
        section.widgets.forEach(widget => {
          widget.w = widget.defaultSize.w;
          widget.h = widget.defaultSize.h;
          widget.minW = widget.defaultSize.minW;
          widget.minH = widget.defaultSize.minH;
          widget.maxW = widget.defaultSize.maxW;
          widget.maxH = widget.defaultSize.maxH;
          widget.x = 0;
          widget.y = sectionHeight;
          sectionHeight += widget.h ?? 1;
        });
        section.w = section.widgets[0]?.w ?? 1;
        section.h = sectionHeight;
      }

      section.x = 0; // Position in page main grid
      section.y = currentY;
      currentY += section.h ?? 1;
    });

    return cloned;
  }
}


import { PageConfig } from './types';
import * as LayoutService from './layoutService';
import { LayoutGenerator } from './layoutGenerator';

export class PageHandler {
  private generator = new LayoutGenerator();

  constructor(private pageName: string, private userId: string) {}

  async loadPage(): Promise<PageConfig> {
    let layout = await LayoutService.fetchUserLayout(this.pageName, this.userId);
    if (layout) return layout;

    const basePage = await LayoutService.fetchBaseLayout(this.pageName);
    const generatedLayout = this.generator.generateLayout(basePage);

    await LayoutService.saveUserLayout({
      pageId: generatedLayout.pageId,
      userId: this.userId,
      overrides: { sections: generatedLayout.sections }
    });

    return generatedLayout;
  }

  async saveUserOverrides(overrides: any): Promise<void> {
    await LayoutService.saveUserLayout({
      pageId: overrides.pageId,
      userId: this.userId,
      overrides
    });
  }
}

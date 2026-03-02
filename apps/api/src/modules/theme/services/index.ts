import { fail, ok, Result } from "@/utils";
import { CreateThemeBody, ThemeResponse, UpdateThemeBody } from "@linktree/validation";
import { ThemeModel } from "@/models/theme";

export const createThemeService = async (userId: string, data: CreateThemeBody): Promise<Result<ThemeResponse>> => {
  try {

    const isThemeExists = await ThemeModel.findOne({ user_id: userId }).lean();

    if (isThemeExists) {
      return fail('ALREADY_EXISTS', 'Theme already exists');
    }

    const theme = await ThemeModel.create({
      user_id: userId,
      background: data.background,
      button: data.button,
      text: data.text,
    });

    const response: ThemeResponse = {
      _id: theme._id.toString(),
      user_id: theme.user_id.toString(),

      background: {
        type: theme.background.type,
        value: theme.background.value,
      },

      button: {
        variant: theme.button.variant,
        radius: theme.button.radius,
        color: theme.button.color,
        textColor: theme.button.textColor,
      },

      text: {
        font: theme.text.font,
        pageColor: theme.text.pageColor,
        titleColor: theme.text.titleColor,
      },

      createdAt: theme.created_at,
      updatedAt: theme.updated_at,
    };

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail('DB_ERROR', 'Failed to create theme');
  }
};

export const updateThemeService = async (userId: string, data: UpdateThemeBody): Promise<Result<ThemeResponse>> => {
  try {
    const theme = await ThemeModel.findOneAndUpdate({ user_id: userId }, data, { new: true });

    if (!theme) {
      return fail('NOT_FOUND', 'Theme not found');
    }

    const response: ThemeResponse = {
      _id: theme._id.toString(),
      user_id: theme.user_id.toString(),

      background: {
        type: theme.background.type,
        value: theme.background.value,
      },

      button: {
        variant: theme.button.variant,
        radius: theme.button.radius,
        color: theme.button.color,
        textColor: theme.button.textColor,
      },

      text: {
        font: theme.text.font,
        pageColor: theme.text.pageColor,
        titleColor: theme.text.titleColor,
      },

      createdAt: theme.created_at,
      updatedAt: theme.updated_at,
    };

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail('DB_ERROR', 'Failed to update theme');
  }
};

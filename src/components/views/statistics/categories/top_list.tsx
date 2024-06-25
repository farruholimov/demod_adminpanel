import { Box, Divider, Grid } from "@mui/material";
import TopList from "../top_list_component";
import SimpleTypography from "../../../typography";
import { useSelector } from "../../../../store";
import { selectCategoriesStats, selectCategoriesStatsStatus } from "../../../../data/statistics/get_categories_stats";
import { selectTopListItemLimit, selectTopListTopic } from "../../../../data/handle_filters";

export function CategoriesTopList() {

  const data = useSelector(selectCategoriesStats)
  const dataStatus = useSelector(selectCategoriesStatsStatus)

  const topListTopic = useSelector(selectTopListTopic)
  const topListItemLimit = useSelector(selectTopListItemLimit)

  return (
    <Box
      sx={{
        width: '100%'
      }}
    >
      <SimpleTypography
        text={`Топ-${topListItemLimit} категорий ${topListTopic?.name}`}
        sx={{
          fontSize: '18px',
          fontWeight: 600,
          mb: '8px'
        }}
      />
      <Divider />
      <TopList
        loading={dataStatus == 'idle' || dataStatus == 'loading' || !data}
        data={
          data?.top_list?.map(e => {
            return {
              name: e?.name,
              link: `/categories`,
              columns: [
                {
                  column_name: Number(e?.models_count) > 1 && Number(e?.models_count) < 4 ? 'модели' : 'моделей',
                  value: e?.models_count
                },
                {
                  column_name:
                    Number(e?.downloads_count || e?.tags_count) > 2 &&
                      Number(e?.downloads_count || e?.tags_count) < 4
                      ? (topListTopic.value == 'downloads' ? 'загрузки' : topListTopic.value == 'tags' ? 'бирки' : '')
                      : Number(e?.downloads_count || e?.tags_count) == 1
                        ? (topListTopic.value == 'downloads' ? 'загрузкa' : topListTopic.value == 'tags' ? 'бирка' : '')
                        : (topListTopic.value == 'downloads' ? 'загрузок' : topListTopic.value == 'tags' ? 'бирки' : ''),

                  value: e?.downloads_count || e?.tags_count
                }
              ]
            }
          })
        }
      />
    </Box>
  )
}
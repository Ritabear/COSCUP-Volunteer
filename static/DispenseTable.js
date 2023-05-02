(function () {
    const tpl = /* html */`
<div class="dispense-table">
    <b-table class="is-fullwidth" :data="rich_dispenses" detailed>
        <b-table-column field="status" label="狀態" v-slot="props">
            <expense-status-label class="tag" :status-code="props.row.status"></expense-status-label>
        </b-table-column>
        <b-table-column field="dispense_date" label="出帳日期" v-slot="props">
            {{props.row.dispense_date}}
        </b-table-column>
        <b-table-column field="invoice_sum" label="總計金額" v-slot="props">
            <invoice-list :invoices="props.row.invoice_sum" />
        </b-table-column>
        <b-table-column field="bank" label="匯款資訊" v-slot="props">
            <p>{{props.row.bank.code}}-{{props.row.bank.branch}}-{{props.row.bank.no}}</p>
            <strong>{{props.row.bank.name}}</strong>
        </b-table-column>
        <b-table-column label="部門" v-slot="props">
            {{unique_items(props.row.expenses, 'tid').join('、')}}
        </b-table-column>
        <b-table-column label="申請人" v-slot="props">
            <div class="is-flex is-align-items-center">
                <user-badge v-for="id in unique_items(props.row.expenses, 'create_by')" :users="users" :id="id" />
            </div>
        </b-table-column>
        <template #detail="props">
            <expense-table
                class="notification"
                :expenses="props.row.expenses"
                :budgets="budgets"
                :users="users"
            ></expense-table>
        </template>
    </b-table>
</div>
`
// 人、狀態、預算清單、金額、匯款資訊、預計出帳日期

    Vue.component('dispense-table', {
        template: tpl,
        props: {
            pid: {
                type: String,
                required: true
            },
            allExpenses: {
                type: Array,
                required: true
            },
            dispenses: {
                type: Array,
                required: true
            },
            budgets: {
                type: Object,
                required: true
            },
            users: {
                type: Object,
                required: true
            },
            statusList: {
                type: Array,
                required:true
            }
        },
        data () {
            return {
            }
        },
        computed: {
            rich_dispenses () {
                return this.dispenses.map((dispense) => {
                    const ret = { ...dispense }
                    ret.expenses = dispense.expense_ids.map((id) => {
                        return this.allExpenses.find(item => item._id === id)
                    })
                    const invoices = ret.expenses.reduce((sum, expense) => {
                        expense.invoices.forEach(({ currency, total }) => {
                            if (!sum[currency]) {
                                sum[currency] = 0
                            }
                            sum[currency] += total
                        })
                        return sum
                    }, {})
                    ret.invoice_sum = Object.entries(invoices).map(([currency, total]) => {
                        return { currency, total }
                    })
                    ret.bank = ret.expenses[0].bank
                    return ret
                })
            }
        },
        watch: {
        },
        methods: {
            unique_items (item_list, key) {
                const unique_items = item_list.reduce((unique, item) => {
                    const value = key ? item[key] : item
                    unique.add(value)
                    return unique
                }, new Set())
                return [...unique_items]
            }
        }
    })
})()
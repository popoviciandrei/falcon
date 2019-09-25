# List of components in @deity/falcon-ecommerce-uikit

### Existing Queries and Mutation classes:

> - ~~RequestPasswordResetMutation~~ - moved to @deity/falcon-shop-data
> - ~~ResetCustomerPasswordMutation~~ - renamed to ResetPasswordMutation and moved to @deity/falcon-shop-data

> - ~~ValidatePasswordTokenQuery~~ - moved to @deity/falcon-shop-data

---

> - ~~EditAddressMutation~~ - moved to @deity/falcon-shop-data
> - ~~AddAddressMutation~~ - moved to @deity/falcon-shop-data
> - ~~RemoveAddressMutation~~ - moved to @deity/falcon-shop-data
> - ~~AddressQuery~~ - moved to @deity/falcon-shop-data
> - ~~AddressListQuery~~ - moved to @deity/falcon-shop-data

---

> - ~~BlogPostQuery~~ - moved to @deity/falcon-blog-data

---

> - ~~AddToCartMutation~~ - moved to @deity/falcon-shop-data
> - ~~RemoveCartItemMutation~~ - moved to @deity/falcon-shop-data
> - ~~UpdateCartItemMutation~~ - moved to @deity/falcon-shop-data
> - ~~ApplyCouponMutation~~ - moved to @deity/falcon-shop-data
> - ~~CancelCouponMutation~~ - moved to @deity/falcon-shop-data
> - ~~CartQuery~~ - moved to @deity/falcon-shop-data

---

> - ~~CategoryProductsQuery~~ renamed to `CategoryWithProductListQuery` moved to @deity/falcon-shop-data

---

> - ~~CheckoutShippingMethod~~ - renamed to `ShippingMethod` moved to @deity/falcon-shop-extension
> - ~~CheckoutPaymentMethod~~ - renamed to `PaymentMethod` moved to @deity/falcon-shop-extension
> - ~~CheckoutLogicInjectedProps~~ renamed to `CheckoutLogicRenderProps` and moved to @deity/falcon-front-kit
> - ~~CheckoutLogicProps~~ - moved to @deity/falcon-front-kit
> - ~~EstimateShippingMethodsMutation~~ - moved to @deity/falcon-shop-data
> - ~~SetShippingMutation~~ - moved to @deity/falcon-shop-data
> - ~~PlaceOrderMutation~~- moved to @deity/falcon-shop-data

---

> - ~~CountriesQuery~~ - renamed to `CountryListQuery` and moved to @deity/falcon-shop-data

---

> - ~~ChangePasswordMutation~~ moved to @deity/falcon-shop-data

---

> - ~~EditCustomerMutation~~ - moved to @deity/falcon-shop-data
> - ~~CustomerQuery~~ - moved to @deity/falcon-shop-data
> - ~~IsAuthenticatedQuery~~ - moved to @deity/falcon-shop-data

---

> - ~~UrlQuery~~ - moved to @deity/falcon-data

---

> - ~~MenuQuery~~ - moved to '@deity/falcon-shop-data'

---

> - ~~MiniAccountQuery~~ renamed to `MiniCustomerQuery` and moved to @deity/falcon-shop-data

---

> - ~~MiniCartQuery~~ - moved to @deity/falcon-shop-data

---

> - ~~GetOrderQuery~~ - renamed to OrderQuery, moved to @deity/falcon-shop-data
> - ~~OrderListQuery~~ - moved to @deity/falcon-shop-data
> - ~~LastOrderQuery~~ - moved to @deity/falcon-shop-data

---

> - ~~ProductQuery~~ - moved to @deity/falcon-shop-data
> - ~~ProductListQuery~~ = moved to @deity/falcon-shop-data

---

> - ~~CloseSidebarMutation~~ - moved to examples/shop-with-blog
> - ~~OpenSidebarMutation~~ - moved to examples/shop-with-blog

---

> - ~~SignInMutation~~ - moved to @deity/falcon-shop-data
> - ~~SignOutMutation~~ - moved to @deity/falcon-shop-data
> - ~~SignUpMutation~~ - moved to @deity/falcon-shop-data

---

> - ~~SortOrdersQuery~~ removed, use `BackendConfigQuery` from  @deity/falcon-shop-data instead

### Existing constants:

> - ~~REQUEST_CUSTOMER_PASSWORD_RESET_TOKEN_MUTATION~~ - changed to `REQUEST_PASSWORD_RESET_TOKEN_MUTATION` and moved to @deity/falcon-shop-data
> - ~~RESET_CUSTOMER_PASSWORD_MUTATION~~ - changed to `RESET_PASSWORD_MUTATION` and moved to @deity/falcon-shop-data
> - ~~VALIDATE_PASSWORD_TOKEN_QUERY~~ - moved to @deity/falcon-shop-data

---

> - ~~EDIT_ADDRESS~~ - moved to @deity/falcon-shop
> - ~~ADD_ADDRESS~~ - moved to @deity/falcon-shop
> - ~~REMOVE_ADDRESS~~ - moved to @deity/falcon-shop
> - ~~GET_ADDRESS~~ - moved to @deity/falcon-shop
> - ~~GET_ADDRESSES_LIST~~ - moved to @deity/falcon-shop

---

> - ~~GET_BACKEND_CONFIG~~ - moved to @deity/falcon-data and @deity/falcon-shop-data
> - ~~SET_LOCALE~~ - moved to @deity/falcon-data

---

> - ~~GET_BLOG_POST~~ - moved to @deity/falcon-blog-data
> - ~~GET_BLOG_POSTS~~ - renamed to GET_BLOG_POST_LIST, moved to @deity/falcon-blog-data

---

> - ~~ADD_TO_CART~~ - moved to @deity/falcon-shop-data
> - ~~REMOVE_CART_ITEM~~ - moved to @deity/falcon-shop-data
> - ~~UPDATE_CART_ITEM~~ - moved to @deity/falcon-shop-data
> - ~~APPLY_COUPON~~ - moved to @deity/falcon-shop-data
> - ~~CANCEL_COUPON~~ - moved to @deity/falcon-shop-data
> - ~~GET_CART~~ - moved to @deity/falcon-shop-data

---

> - ~~GET_CATEGORY_PRODUCTS~~ - renamed to `GET_CATEGORY_WITH_PRODUCTS` and moved to @deity/falcon-shop-data

---

> - ~~ESTIMATE_SHIPPING_METHODS~~ - moved to @deity/falcon-shop-data
> - ~~SET_SHIPPING~~ - moved to @deity/falcon-shop-data
> - ~~PLACE_ORDER~~ - moved to @deity/falcon-shop-data

---

> - ~~GET_CONFIG~~ - renamed to GET_CLIENT_CONFIG and moved to @deity/falcon-front-kit

---

> - ~~GET_COUNTRIES~~ - renamed to `GET_COUNTRY_LIST` and moved to @deity/falcon-shop-data

---

> - ~~CHANGE_PASSWORD~~ - moved to @deity/falcon-shop
> - ~~EDIT_CUSTOMER~~ - moved to @deity/falcon-shop
> - ~~GET_CUSTOMER~~ - moved to @deity/falcon-shop
> - ~~GET_CUSTOMER_WITH_ADDRESSES~~ - moved to @deity/falcon-shop
> - ~~GET_IS_AUTHENTICATED~~ - moved to @deity/falcon-shop

---

> - ~~GET_URL~~ - moved to @deity/falcon-data

---

> - ~~GET_MENU~~ - moved to @deity/falcon-data

---

> - ~~GET_MINI_ACCOUNT~~ - renamed to `GET_MINI_CUSTOMER` and moved to @deity/falcon-shop-data

---

> - ~~GET_MINI_CART~~ - moved to @deity/falcon-shop-data

---

> - ~~GET_ORDER~~ - moved to @deity/falcon-shop-data
> - ~~GET_LAST_ORDER~~ - moved to @deity/falcon-shop-data
> - ~~GET_ORDER_LIST~~ - moved to @deity/falcon-shop-data

---

> - ~~GET_PRODUCT~~ - moved to @deity/falcon-shop-data
> - ~~GET_PRODUCT_LIST~~ - moved to @deity/falcon-shop-data

---

> - ~~OPEN_SIDEBAR_MUTATION~~ - moved to @deity/falcon-ui-kit
> - ~~CLOSE_SIDEBAR_MUTATION~~ - moved to @deity/falcon-ui-kit

---

> - ~~SIGN_IN_MUTATION~~ - moved to @deity/falcon-shop-data
> - ~~SIGN_OUT_MUTATION~~ - moved to @deity/falcon-shop-data
> - ~~SIGN_UP_MUTATION~~ - moved to @deity/falcon-shop-data

---

> - ~~SORT_ORDERS_QUERY~~ changed to `GET_SORT_ORDER_LIST` and moved to @deity/falcon-data

### Existing TypeScript types and interfaces (without component props definitions):

> - ~~RequestPasswordResetVariables~~ - renamed to RequestPasswordResetVariables and moved to @deity/falcon-shop-data
> - ~~ResetCustomerPasswordVariables~~ - moved to @deity/falcon-shop-data

---

> - ~~AddressType~~ - changed to `Address` and moved to @deity/falcon-shop-extension
> - ~~AddressListData~~ - changed to `AddressListResponse` and moved to @deity/falcon-shop-data

---

> - ~~BackendConfig~~ - moved to @deity/falcon-data and @deity/falcon-shop-data
> - ~~SetLocaleData~~ - moved to @deity/falcon-data

---

> - ~~BlogPostType~~ - renamed to BlogPostResponse, moved to @deity/falcon-blog-data
> - ~~BlogPostQueryVariables~~ - moved to @deity/falcon-blog-data

> - ~~BlogPostExcerptType~~ - renamed to `BlogPost` and moved to @deity/falcon-blog-data
> - ~~BlogPagination~~ - removed, used `Pagination` instead
> - ~~BlogPosts~~ - renamed to BlogPostList, moved to @deity/falcon-blog-data
> - ~~BlogPostsQueryVariables~~ renamed to BlogPostListQueryVariables, moved to @deity/falcon-blog-data

---

> - ~~CartData~~ - renamed to `CartResponse` and moved to @deity/falcon-shop-data

---

> - ~~Aggregation~~ - moved to @deity/falcon-data
> - ~~SelectionType~~ - moved to @deity/falcon-data
> - ~~AggregationBucket~~ - moved to @deity/falcon-data

---

> - ~~EstimateShippingMethodsData~~ - renamed to EstimateShippingMethodsResponse and move to @deity/falcon-shop-data
> - ~~SetShippingData~~ - renamed to SetShippingResponse and moved to @deity/falcon-shop-data
> - ~~PlaceOrderSuccessfulResult~~ - moved to @deity/falcon-shop-extension
> - ~~PlaceOrder3dSecureResult~~ - moved to @deity/falcon-shop-extension
> - ~~PlaceOrder3dSecureField~~ - moved to @deity/falcon-shop-extension
> - ~~PlaceOrderResult~~ - moved to @deity/falcon-shop-extension

---

> - ~~ConfigQuery~~ renamed to ClientConfigQuery and moved to @deity/falcon-front-kit

---

> - ~~Country~~ - moved to @deity/falcon-shop-extension
> - ~~CountriesData~~ renamed to `CountryList` moved to  @deity/falcon-shop-extension

---

> - ~~CreditCardState~~ hide, I think we should not export any component state

---

> - ~~Customer~~ - moved to @deity/falcon-shop-extension
> - ~~CustomerQueryData~~ - changed to `CustomerResponse` and moved to @deity/falcon-shop-data
> - ~~IsAuthenticatedQueryData~~ - changed to `IsAuthenticatedResponse` and moved to @deity/falcon-shop-data

---

> - ~~DynamicUrl~~ moved to @deity/falcon-data
> - ~~UrlQueryVariables~~ moved to @deity/falcon-data
> - ~~UrlQueryData~~ changed to `UrlResponse` and moved to @deity/falcon-data/dist/Url/UrlQuery

---

> - ~~EnsureTTIRenderProps~~ moved to @deity/falcon-front-kit

---

> - ~~FilterInput~~ moved to @deity/falcon-shop-extension
> - ~~FilterOperator~~ moved to @deity/falcon-shop-extension
> - ~~FilterData~~ moved to @deity/falcon-front-kit
> - ~~FilterOption~~ moved to @deity/falcon-front-kit
> - ~~FilterDataProviderRenderProps~~ changed to `FiltersDataProviderRenderProps` and moved to @deity/falcon-front-kit
> - ~~MultipleFilterProps~~ moved to @deity/falcon-ui-kit
> - ~~SingleFilterProps~~ moved to @deity/falcon-ui-kit

---

> - ~~LocaleItem~~ moved to @deity/falcon-front-kit

---

> - ~~FieldRenderProps~~ - moved to @deity/falcon-ui-kit
> - ~~FieldProps~~ - moved to @deity/falcon-ui-kit
> - ~~FormContextValue~~ - moved to @deity/falcon-ui-kit
> - ~~FormContext~~ - moved to @deity/falcon-ui-kit
> - ~~formLayout~~ - moved to @deity/falcon-ui-kit and renamed to `form`
> - ~~FormProps~~ - moved to @deity/falcon-ui-kit
> - ~~FormFieldRenderProps~~ - moved to @deity/falcon-ui-kit
> - ~~FormFieldProps~~ - moved to @deity/falcon-ui-kit

---

> - ~~LocaleContextType~~ moved to @deity/falcon-front-kit
> - ~~LocaleContext~~ moved to @deity/falcon-front-kit

---

> - ~~Menu~~ - renamed to `MenuResponse` and moved to @deity/falcon-shop-data
> - ~~MenuItem~~ moved to @deity/falcon-shop-extension

---

> - ~~MiniAccountData~~ renamed to `MiniCustomerResponse` and moved to @deity/falcon-shop-data

---

> - ~~MiniCartData~~ -renamed to `MiniCartResponse` and moved to @deity/falcon-shop-data

---

> - ~~Order~~ - moved to @deity/falcon-shop-data
> - ~~OrderItem~~ - moved to @deity/falcon-shop-data

---

> - ~~OrdersData~~ - renamed to OrderList, moved to @deity/falcon-shop-data

---

> - ~~Products~~ - moved to @deity/falcon-shop-data and renamed to `ProductList`

---

> - ~~SearchState~~ moved to @deity/falcon-ui-kit
> - ~~SearchContextType~~ changed to `SearchContextValue` and moved to @deity/falcon-ui-kit
> - ~~SearchContext~~ moved to @deity/falcon-ui-kit
> - ~~SearchConsumer~~ moved to @deity/falcon-ui-kit
> - ~~SearchProviderProps~~ moved to @deity/falcon-ui-kit

---

> - ~~SignInModel~~ - renamed to `SignInInput` and moved to @deity/falcon-shop-extension
> - ~~SignInData~~ - renamed to `SignInResponse` and moved to @deity/falcon-shop-data
> - ~~SignOutLogicRenderProps~~ - renamed to SignOutProviderRenderProps, moved to @deity/falcon-ui-kit
> - ~~SignUpVariables~~ moved to @deity/falcon-shop-extension and renamed to SignUpInput

---

> - ~~SortOrderDirection~~ - moved to @deity/falcon-data
> - ~~SortOrderInput~~ - changed to `SortOrderValue` moved to @deity/falcon-data

> - ~~SortOrders~~ changed to `SortOrderList` and moved to @deity/falcon-data
> - ~~SortOrdersData~~ changed to `SortOrderListResponse` and moved to @deity/falcon-data

> - ~~Pagination~~ - moved to @deity/falcon-data
> - ~~PaginationQuery~~ - moved to @deity/falcon-data
> - ~~PaginationInput~~ - moved to @deity/falcon-data

### Existing UI components:

> - ~~ForgotPasswordForm~~ - moved to @deity/falcon-ui-kit
> - ~~ResetPassword~~ - moved to @deity/falcon-ui-kit
> - ~~InvalidToken~~ - moved to @deity/falcon-ui-kit
> - ~~ResetPasswordForm~~ - moved to @deity/falcon-ui-kit
> - ~~ResetPasswordSuccess~~ - moved to @deity/falcon-ui-kit
> - ~~ResetPasswordSuccess~~ - moved to @deity/falcon-ui-kit

---

> - ~~AddressDetails~~ - moved to @deity/falcon-ui-kit/src/Address/AddressDetails.tsx (extracted AddressDetailsLayout)
> - ~~addressToString~~ - moved to @deity/falcon-front-kit
> - ~~AddressCardLayout~~ - moved to @deity/falcon-ui-kit/src/Address/AddressCard.tsx
> - ~~AddressCard~~ - moved to @deity/falcon-ui-kit/src/Address/AddressCard.tsx
> - ~~AddressListLayout~~ - moved to @deity/falcon-ui-kit/src/AddressListLayout.tsx

---

> - ~~BackendConfigQuery~~ moved to @deity/falcon-data
> - ~~SetLocaleMutation~~ moved to @deity/falcon-data

---

> - ~~BlogPost~~ - moved to examples/shop-with-blog
> - ~~BlogPostExcerpt~~ moved to @deity/falcon-ui-kit
> - ~~BlogPostsLayout~~ - renamed to BlogPostListLayout and moved to @deity/falcon-ui-kit
> - ~~BlogPostsPaginator~~ moved to examples/shop-with-blog
> - ~~CMSContent~~ - moved to @deity/falcon-ui-kit

---

> - ~~CategoryLayout~~ moved to @deity/falcon-ui-kit
> - ~~ShowingOutOf~~ moved to examples/shop-with-blog
> - ~~ShowMore~~ moved to examples/shop-with-blog
> - ~~SortOrderDropdownLayout~~ changed to `SortOrderPickerLayout` and moved to @deity/falcon-ui-kit
> - ~~SortOrderDropdown~~ changed to `SortOrderPicker` and moved to @deity/falcon-ui-kit

> - ~~TotalRow~~ - removed, (introduced PropertyRowLayout in @deity/falcon-ui-kit)

---

> - ~~CountrySelector~~ renamed to CountryPicker and moved to @deity/falcon-ui-kit

---

> - ~~CreditCard~~ renamed to CreditCardInput, and moved to @deity/falcon-ui-kit

---

> - ~~NotFound~~ moved to @deity/falcon-ui-kit

---

> - ~~ColorTile~~ moved to @deity/falcon-ui-kit
> - ~~ColorFilter~~ moved to @deity/falcon-ui-kit
> - ~~FilterSummary~~ moved to @deity/falcon-ui-kit and renamed to `FilterDetailsSummaryLayout`
> - ~~FilterDetails~~ moved to @deity/falcon-ui-kit
> - ~~FilterItemLayout~~ moved to @deity/falcon-ui-kit
> - ~~FilterItem~~ moved to @deity/falcon-ui-kit
> - ~~FilterItemList~~ moved to @deity/falcon-ui-kit and renamed to `FilterItemListLayout`
> - ~~FiltersLayout~~ moved to @deity/falcon-ui-kit and renamed to `FiltersPanelLayout`
> - ~~FiltersSummaryLayout~~ moved to @deity/falcon-ui-kit and renamed to `SelectedFilterList`
> - ~~FiltersSummary~~ moved to @deity/falcon-ui-kit
> - ~~FilterTile~~ moved to @deity/falcon-ui-kit
> - ~~MultipleFilter~~ moved to @deity/falcon-ui-kit
> - ~~SingleFilter~~ moved to @deity/falcon-ui-kit

---

> - ~~CopyrightLayout~~ renamed to FooterBanner, moved to @deity/falcon-ui-kit
> - ~~Copyright~~ moved to @deity/falcon-ui-kit
> - ~~FooterLayout~~ renamed to Footer, moved to @deity/falcon-ui-kit
> - ~~FooterSectionsLayout~~ renamed to FooterSectionListLayout moved to @deity/falcon-ui-kit
> - ~~FooterSectionLayout~~ moved to @deity/falcon-ui-kit
> - ~~FooterLink~~ moved to examples/shop-with-blog
> - ~~LanguageSection~~ - removed

> - ~~LocaleSwitcherDropdown~~ - moved to @deity/falcon-ui-kit and renamed to `LocalePicker`
> - ~~LocaleSwitcherRenderProps~~ moved to @deity/falcon-ui-kit and renamed to `LocalePickerProps`

> - ~~NewsletterLayout~~ - moved to @deity/falcon-ui-kit
> - ~~Newsletter~~ - moved to @deity/falcon-ui-kit

---

> - ~~FormErrorSummary~~ - moved to @deity/falcon-ui-kit
> - ~~FormFieldLayout~~ - moved to @deity/falcon-ui-kit
> - ~~FormFieldLabel~~ - moved to @deity/falcon-ui-kit
> - ~~FormFieldError~~ - moved to @deity/falcon-ui-kit
> - ~~FormField~~ - moved to @deity/falcon-front-kit
> - ~~getDefaultInputTypeValidator~~ - moved to @deity/falcon-front-kit and renamed to `inputTypeToDefaultValidatorsMapper`
> - ~~passwordValidator~~ - moved to @deity/falcon-front-kit
> - ~~emailValidator~~ - moved to @deity/falcon-front-kit

> - ~~CheckboxFormFieldLayout~~ - moved to @deity/falcon-ui-kit
> - ~~CheckboxFormField~~ - moved to @deity/falcon-ui-kit
> - ~~RadioFormFieldLayout~~ - moved to @deity/falcon-ui-kit
> - ~~RadioFormField~~ - moved to @deity/falcon-ui-kit
> - ~~FormSubmit~~ - moved to @deity/falcon-ui-kit
> - ~~PasswordRevealInput~~ - moved to @deity/falcon-ui-kit

---

> - ~~BannerLayout~~ - renamed to HeaderBannerLayout moved to @deity/falcon-ui-kit
> - ~~Banner~~ - moved to examples/shop-with-blog

> - ~~Searchbar~~ - removed
> - ~~Header~~ - moved to examples/shop-with-blog

---

> - ~~DateFormat~~ - moved to @deity/falcon-ui-kit
> - ~~Price~~ - moved to @deity/falcon-ui-kit

---

> - ~~MenuNavbar~~ - moved to @deity/falcon-ui-kit

---

> - ~~AccountIcon~~ - moved to @deity/falcon-ui-kit
> - ~~ForgotPassword~~ - moved to @deity/falcon-ui-kit
> - ~~ForgotPasswordFormProvider~~ extracted from `ForgotPassword` and moved to @deity/falcon-front-kit
> - ~~MiniAccount~~ - removed - because it should be located in example project, but it is not used anymore
> - ~~MiniFormLayout~~ - renamed to SidebarLayout and moved to @deity/falcon-ui-kit
> - ~~NewAccount~~ - extracted and moved to @deity/falcon-ui-kit

> - ~~SignIn~~ - removed, use `SignInForm` from @deity/falcon-ui-kit instead 
> - ~~SignUp~~ - removed, use `SignUpForm` from @deity/falcon-ui-kit instead 

---

> - ~~MiniCart~~ - moved to @deity/falcon-ui-kit
> - ~~MiniCartIcon~~ - renamed to CartIcon moved to @deity/falcon-ui-kit

> - ~~OrderItemSummary~~ - moved to @deity/falcon-ui-kit

---

> - ~~NoOrders~~ - renamed to EmptyOrderList and moved to @deity/falcon-ui-kit
> - ~~OrderList~~ - moved to examples/shop-with-blog
> - ~~OrderListLayout~~ moved to @deity/falcon-ui-kit
> - ~~OrderListItem~~ - moved to examples/shop-with-blog
> - ~~OrderListHeader~~ moved to @deity/falcon-ui-kit (not sure if correct)

---

> - ~~Option~~ - renamed to `ProductOption` and moved to @deity/falcon-ui-kit
> - ~~ProductConfigurableOptions~~ - renamed to `ProductOptionList` and moved to @deity/falcon-ui-kit
> - ~~ProductLayout~~ - renamed to `PageLayout` and moved to @deity/falcon-ui-kit
> - ~~ProductDescriptionLayout~~ - renamed to `ProductLayout` moved to @deity/falcon-ui-kit
> - ~~Area~~ (product) - renamed to `ProductLayoutAreas` moved to @deity/falcon-ui-kit
> - ~~ProductDetailsLayout~~ - moved to @deity/falcon-ui-kit

> - ~~Product~~ - moved to examples/shop-with-blog
> - ~~ProductGallery~~ - moved to @deity/falcon-ui-kit
> - ~~NoProductImage~~ - renamed to `NoProductImagePlaceholder` and moved to @deity/falcon-ui-kit
> - ~~ProductMeta~~ - moved to @deity/falcon-ui-kit
> - ~~EmptyProductList~~ - moved to @deity/falcon-ui-kit
> - ~~EmptyProductListLayout~~ moved to @deity/falcon-ui-kit
> - ~~ProductCardLayout~~ moved to @deity/falcon-ui-kit
> - ~~ProductCard~~ moved to @deity/falcon-ui-kit
> - ~~ProductList~~ moved to @deity/falcon-ui-kit
> - ~~ProductListLayout~~ - moved to @deity/falcon-ui-kit
> - ~~Loader~~ - moved to to @deity/falcon-ui-kit

---

> - ~~Responsive~~ - moved to @deity/falcon-ui-kit/src/Responsive/Responsive.tsx

---

> - ~~Sidebar~~ - moved to @deity/falcon-ui-kit

---

> - ~~ForgotPasswordTrigger~~ - merged with SignInForm
> - ~~SignInForm~~ - moved to @deity/falcon-ui-kit and extracted SignInFormProvider to @deity/falcon-front-kit
> - ~~SignInIcon~~ - moved to @deity/falcon-ui-kit
> - ~~SignUpForm~~ - moved to @deity/falcon-ui-kit and extracted SignUpFormProvider to @deity/falcon-front-kit

---

> - ~~AppLayout~~ -moved to `@deity/falcon-ui-kit/src/Layouts/AppLayout.tsx`
> - ~~Breadcrumbs~~ - moved to @deity/falcon-ui-kit
> - ~~FixCenteredLayout~~ - moved to `@deity/falcon-ui-kit/src/Layouts/FixCenteredLayout.tsx`
> - ~~TwoColumnsLayout~~ - moved to `@deity/falcon-ui-kit`
> - ~~TwoStepWizard~~ - moved to `@deity/falcon-ui-kit`

> - added `DeityLogo` into `@deity/falcon-ui-kit`

### Existing "business level" components:

> - ~~CheckoutLogic~~ moved to @deity/falcon-front-kit

> - ~~DynamicRoute~~ moved to @deity/falcon-front-kit
> - ~~EnsureTTI~~ moved to @deity/falcon-front-kit
> - ~~ScrollToTop~~ moved to @deity/falcon-front-kit

> - ~~FiltersDataProvider~~ moved to @deity/falcon-front-kit
> - ~~LocaleSwitcher~~ moved to @deity/falcon-front-kit
> - ~~Field~~ moved to to @deity/falcon-front-kit
> - ~~Form~~ moved to to @deity/falcon-front-kit
> - ~~LocaleProvider~~ moved to @deity/falcon-front-kit
> - ~~ProductForm ~~ extracted AddToCartFormProvider and moved to @deity/falcon-front-kit
> - ~~ProductConfigurator~~ moved to @deity/falcon-front-kit but, not used and extracted two functions and moved them into @deity/falcon-front-kit/productConfigurableOptionMappers

> - ~~Query~~ moved to @deity/falcon-data
> - ~~OnlyUnauthenticatedRoute~~ moved to @deity/falcon-front-kit
> - ~~ProtectedRoute~~ moved to @deity/falcon-front-kit
> - ~~Router~~ moved to @deity/falcon-front-kit

> - ~~SearchProvider~~ moved to @deity/falcon-front-kit
> - ~~SignOutLogic~~ - renamed to SignOutProvider and moved to @deity/falcon-front-kit - but not using it
> - ~~SortOrdersProvider~~ change to `SortOrderPickerProvider` and moved to @deity/falcon-front-kit
> - ~~AreSortOrderInputsEqual~~ changed to `areSortOrderInputsEqual` and moved to @deity/falcon-front-kit
> - ~~OnlineStatus~~ changed to `NetworkStatus` and moved to @deity/falcon-front-kit
